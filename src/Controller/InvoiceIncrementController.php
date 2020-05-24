<?php

namespace App\Controller;

use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class InvoiceIncrementController extends AbstractController
{
    /** @var EntityManagerInterface
     */
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }
   
    public function __invoke(Invoice $data)
    {
        $data->setChrono($data->getChrono() + 1);
        $this->em->flush();
        return $data;        
    }
}
