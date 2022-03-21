<?php

namespace App\Controller;

use App\Form\ShopifyArticleType;
use Stephane888\WbuShopify\ApiRest\Articles\Articles;
use Stephane888\WbuShopify\ApiRest\Blog\Blog;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ArticleController extends AbstractController
{
    /**
     * @Route("/article/create", name="app_articlee_crea")
     */
    public function createArticle(Request $request): Response
    {
        $shopDomain = $this->getParameter('app.shopify_host');
        $apiKey = $this->getParameter('app.shopify_api_key');
        $secret = $this->getParameter('app.shopify_secret');
        $token = $this->getParameter('app.shopify_token');

        $configs = array(
            'shop_domain' => $shopDomain,
            'api_key' => $apiKey,
            'secret' => $secret,
            'token' => $token
        );

        $blog = new Blog($configs);
        $blogs = $blog->getBlogs();
        $blogIds = [];

        foreach ($blogs['blogs'] as $blog ) {
            $blogIds[ $blog['title'] ] = $blog['id'];
        }



        $form = $this->createForm(ShopifyArticleType::class, $options = ['blogIds' => $blogIds]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $content = $form->getData();
            $blogId = $content["blog_id"];
            $src = $content["image"];
            unset($content["blogIds"]);
            unset($content["image"]);
            $content["image"] = ["src" => $src];
            
            $article = new Articles($configs);
            $result = $article->addArticle($content, $blogId);
            
            return $this->json($result);

        }

        return $this->render('article/create.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
