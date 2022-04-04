<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/comptability")
 */
class ComptabilityController extends AbstractController
{
    /**
     * @Route("/", name="app_comptability")
     */
    public function index(): Response
    {
        return $this->render('comptability/index.html.twig');
    }

    /**
     * @Route("/order", name="app_comptability_order")
     */
    public function order(): Response
    {
        return $this->render('comptability/order.html.twig');
    }
}
