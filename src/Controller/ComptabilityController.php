<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ComptabilityController extends AbstractController
{
    /**
     * @Route("/comptability", name="app_comptability")
     */
    public function index(): Response
    {
        return $this->render('comptability/index.html.twig');
    }
}
