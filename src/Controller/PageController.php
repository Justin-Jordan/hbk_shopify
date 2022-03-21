<?php

namespace App\Controller;

use App\Form\ShopifyPageType;
use Stephane888\WbuShopify\ApiRest\Page\Page;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PageController extends AbstractController
{
    /**
     * @Route("/page/create", name="app_page_create")
     */
    public function createPage(Request $request): Response
    {
        $form = $this->createForm(ShopifyPageType::class);

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

            $content = $form->getData();

            $page = new Page($configs);

            $result = $page->addPage($content);
            return $this->json($result);
        }



        return $this->render('page/create.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
