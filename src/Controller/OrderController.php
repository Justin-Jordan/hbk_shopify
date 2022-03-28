<?php

namespace App\Controller;

use App\Form\ShopifyOrderType;
use Stephane888\WbuShopify\ApiRest\Order\Order;
use Stephane888\WbuShopify\ApiRest\Prodcuts\Product;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class OrderController extends AbstractController
{
    /**
     * @Route("/order/create", name="app_order")
     */
    public function create(Request $request): Response
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

        $product = new Product($configs);
        $products = $product->getProducts();
        $productIds = [];

        foreach ($products['products'] as $p ) {
            $productIds[ $p['title'] ] = $p['id'];
        }


        $form = $this->createForm(ShopifyOrderType::class, $options = ['productIds' => $productIds]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $content = $form->getData();
            unset($content["productIds"]);
            
            $order = new Order($configs);
            $result = $order->addOrder([$content]);
            dd($result);
            
            return $this->json($result);

        }

        return $this->render('order/create.html.twig', [
            'form' => $form->createView(),
        ]);
    }
    
}
