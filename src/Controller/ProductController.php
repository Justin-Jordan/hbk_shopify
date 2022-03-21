<?php

namespace App\Controller;

use App\Form\ShopifyProductType;
use Stephane888\WbuShopify\ApiRest\Prodcuts\Product;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProductController extends AbstractController
{
    /**
    /**
     * @Route("/product/create", name="app_prodcuct_create")
     */
    public function createPage(Request $request): Response
    {
        $form = $this->createForm(ShopifyProductType::class);

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

            $page = new Product($configs);

            $result = $page->addProduct($content);
            return $this->json($result);
        }



        return $this->render('product/create.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
