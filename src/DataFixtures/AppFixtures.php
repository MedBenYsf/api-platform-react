<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * Encoder user password
     *
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');

        for ($u = 0; $u < 10; $u++) {
            $chrono = 1;
            $user = new User();
            $hash = $this->encoder->encodePassword($user, 'password');
            $user->setFirstName($faker->firstName())
                 ->setLastName($faker->lastName())
                 ->setEmail($faker->email)
                 ->setPassword($hash);
            $manager->persist($user);

            for ($i = 0; $i < mt_rand(5, 20); $i++) {
                $customer = new Customer();
                $customer->setFirstName($faker->firstName)
                         ->setLastName($faker->lastName)
                         ->setEmail($faker->email)
                         ->setCompany($faker->company)
                         ->setUser($user);
                    $manager->persist($customer);
    
                for ($j = 0; $j < mt_rand(3, 10); $j++) {
                    $invoice = new Invoice();
                    $invoice->setAmount($faker->randomFloat(2, 200, 4000))
                            ->setSentAt($faker->dateTimeBetween('-6 months'))
                            ->setStatus($faker->randomElement(['SENTED', 'PAID', 'CANCELLED']))
                            ->setCustomer($customer)
                            ->setChrono($chrono);
                        $chrono++;
                    $manager->persist($invoice);
                }
            }
        }

        $manager->flush();
    }
}
