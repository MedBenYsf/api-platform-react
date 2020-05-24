<?php

namespace App\Entity;

use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\InvoiceRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 * @ORM\Table(name="invoices")
 * @ApiResource(
 *      subresourceOperations={
 *          "api_customers_invoices_get_subresource"={
 *              "normalization_context"={
 *                  "groups"={"invoices_subresource"}
 *              }
 *          }
 *      },
 *      itemOperations={"GET", "PUT", "DELETE",
 *          "increment"={
 *              "method"="POST",
 *              "path"="/invoices/{id}/increment",
 *              "controller" ="App\Controller\InvoiceIncrementController",
 *              "openapi_context"={
 *                  "summary"="increment chrono invoice",
 *                  "description"="increment chrono of an invoice"
 *              }
 *          }
 *      },
 *      attributes={
 *      "pagination_enabled"=true,
 *      "pagination_items_per_page"=20,
 *      "order"={"amount":"desc"}
 *      },
 *      normalizationContext={
 *          "groups"={"invoices_read"}
 *      },
 *      denormalizationContext={
 *          "disable_type_enforcement"=true
 *      }
 * )
 * @ApiFilter(SearchFilter::class, properties={"customer.firstName": "partial"})
 * @ApiFilter(OrderFilter::class, properties={"amount", "sentAt",})
 */
class Invoice
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="amount est obligatoire")
     * @Assert\Type(type="numeric", message="amount doit etre numérique")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="sentAt est obligatoire")
     * @Assert\Type(type="DateTime", message="Le format de date doit etre YYYY-MM-DD")
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="status est obligatoire")
     * @Assert\Choice(choices={"SENT", "PAID", "CANCELLED"})
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * @Assert\NotBlank(message="customer est obligatoire")
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "invoices_subresource"})
     * @Assert\NotBlank(message="chrono est obligatoire")
     * @Assert\Type(type="numeric", message="chrono doit etre numérique")
     */
    private $chrono;

    /**
     * Get user of invoice
     * 
     * @Groups({"invoices_read", "invoices_subresource"})
     * @return User
     */
    public function getUser(): User
    {
        return $this->customer->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt($sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
