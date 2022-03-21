<?php

namespace App\Controller;

use App\Form\ShopifyBlogType;
use App\Service\ShopifyApiService;
use Shopify\Clients\Rest;
use Shopify\Context;
use Shopify\Auth\FileSessionStorage;
use Shopify\Api;
use Shopify\Service\ProductService;
use Stephane888\WbuShopify\ApiRest\Articles\Articles;
use Stephane888\WbuShopify\ApiRest\Authentification\IntegrationToken;
use Stephane888\WbuShopify\ApiRest\Blog\Blog;
use Stephane888\WbuShopify\ApiRest\Prodcuts\Product;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

use function Symfony\Component\DependencyInjection\Loader\Configurator\param;

class BlogController extends AbstractController
{
    /**
     * @Route("/", name="app_home")
     */
    public function index(ContainerBagInterface $params): Response
    {
        $configs = array();

        $prod = new Product($configs);
        return $this->json($prod);
        dd($prod->getProducts());


        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }




    /**
     * @Route("/shopify/request.php", name="app_request")
     */
    public function request(ContainerBagInterface $params, Request $request): Response
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

        $csrfToken = $request->headers->get('x-csrf-token');
        $dataBaseConfig = json_decode($request->getContent());
        $data = [];

        switch ($csrfToken) {
            case 'shopify_load_blogs_with_metafield':
                $blog = new Blog($configs);
                $shopifyLoadBlog = $blog->getBlogs();
                break;

            default:

                break;
        }


        $data = [
            "token" => $csrfToken,
            "return" => [
                "shopify_load_blog" => $shopifyLoadBlog,
            ],
        ];


        return $this->json($data);
    }

    /**
     * @Route("/blog/create", name="app_blog_create")
     */
    public function createBlog(ContainerBagInterface $params, request $request): Response
    {

        $form = $this->createForm(ShopifyBlogType::class);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
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

            $title = $form->get('title')->getData();

            $blog = new Blog($configs);

            $result = $blog->addBlog($title);
            return $this->json($result);
        }



        return $this->render('blog/create-blog.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
