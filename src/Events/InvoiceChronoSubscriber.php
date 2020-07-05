<?php

namespace App\Events;

use App\Repository\InvoiceRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class InvoiceChronoSubscriber implements EventSubscriberInterface
{
    private $security;
    private $repository;

    public function __construct(Security $security, InvoiceRepository $repository)
    {
        $this->security = $security;
        $this->repository = $repository;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setChronoInvoice', EventPriorities::PRE_VALIDATE],
        ];
    }

    public function setChronoInvoice(ViewEvent $event)
    {
        //dd($this->repository->getNextChrono($this->security->getUser()));
        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($invoice instanceof Invoice && 'POST' === $method) {
            $invoice->setChrono($this->repository->getNextChrono($this->security->getUser()));
            if ($invoice->getSentAt() === null) {
                $invoice->setSentAt(new \DateTime());
            }
        }
    }
}
