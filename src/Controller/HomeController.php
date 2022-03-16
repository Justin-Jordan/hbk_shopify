<?php

namespace App\Controller;

use App\Service\ShopifyApiService;
use Shopify\Clients\Rest;
use Shopify\Context;
use Shopify\Auth\FileSessionStorage;
use Shopify\Api;
use Shopify\Service\ProductService;
use Stephane888\WbuShopify\ApiRest\Authentification\IntegrationToken;
use Stephane888\WbuShopify\ApiRest\Prodcuts\Product;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

use function Symfony\Component\DependencyInjection\Loader\Configurator\param;

class HomeController extends AbstractController
{
    /**
     * @Route("/", name="app_home")
     */
    public function index(ContainerBagInterface $params): Response
    {
        $configs = array(
            "api_key" => '',
            'shop_domain' => '',
            'secret' => ''
        );

        $conf = array(
            "token" => '',
            'domain' => '',
        );

        $prod = new Product($configs);
        dd($prod->getProducts());
        

        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }

    /**
     * @Route("/token", name="app_token")
     */
    public function generateToken(): Response
    {
        $api_key = "355b616368888c81a208d17683ab1a94";
        $shared_secret = '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';

        // Set variables for our request
        $shared_secret = "TBB5wltKarRtKn5mUVZck9RxHePNN6Jo";
        $params = $_GET; // Retrieve all request parameters
        $hmac = $_GET['hmac']; // Retrieve HMAC request parameter
        $params = array_diff_key($params, array('hmac' => '')); // Remove hmac from params
        ksort($params); // Sort params lexographically

        // Compute SHA256 digest
        $computed_hmac = hash_hmac('sha256', http_build_query($params), $shared_secret);

        // Use hmac data to check that the response is from Shopify or not
        if (hash_equals($hmac, $computed_hmac)) {
            // VALIDATED
        } else {
            // NOT VALIDATED – Someone is trying to be shady!
        }

        // Set variables for our request
        $query = array(
            "client_id" => $api_key, // Your API key
            "client_secret" => $shared_secret, // Your app credentials (secret key)
            "code" => $params['code'] // Grab the access key from the URL
        );
        
        // Generate access token URL
        $access_token_url = "https://" . $params['shop'] . "/admin/oauth/access_token";
        
        //dd($access_token_url);
        // Configure curl client and execute request
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_URL, $access_token_url);
        curl_setopt($ch, CURLOPT_POST, count($query));
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($query));
        $result = curl_exec($ch);
        curl_close($ch);

        // Store the access token
        $result = json_decode($result, true);
        $access_token = $result['access_token'];

        dd($access_token);
    }
}
