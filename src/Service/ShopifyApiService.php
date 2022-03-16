<?php

namespace App\Service;

use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
use Shopify\Context;
use Shopify\Clients\Rest;

class ShopifyApiService
{

    private $params;
    private $context;

    public function __construct(ContainerBagInterface $params, Context $context)
    {
        $this->params = $params;
        $this->context = $context;
    }

    public function shop()
    {
        $shopify = $this->context->initialize(
            $this->params->get('app.shopify_api_key'),
            $this->params->get('app.shopify_api_secret'),
            $this->params->get('app.shopify_api_scope'),
            $this->params->get('app.shopify_api_host'),
            \Shopify\Auth\SessionStorade
        );

        $client = new Rest($shopify->getShop(), $shopify->getAccessToken());
        $response = $client->get('products');
    }
}
