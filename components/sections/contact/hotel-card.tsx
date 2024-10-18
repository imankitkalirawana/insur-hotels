'use client';
import { Hotel } from '@/lib/interface';
import {
  Card,
  CardHeader,
  Divider,
  CardBody,
  Input,
  DatePicker,
  Button,
  Skeleton,
  ModalBody,
  ModalContent,
  Modal,
  ModalHeader,
  useDisclosure
} from '@nextui-org/react';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect } from 'react';
import { I18nProvider } from '@react-aria/i18n';
import { parseDate, getLocalTimeZone, today } from '@internationalized/date';
import Image from 'next/image';
import Link from 'next/link';
import slugify from 'slugify';

interface Props {
  hotel: string;
}

export default function HotelCard({ hotel }: Props) {
  const submittedModal = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/hotels/name/${hotel}`);
      const data = await res.json();
      formik.setValues((prev) => ({
        ...prev,
        hotel: data.name,
        to: data.email,
        hotelPhone: data.phone,
        image: data.banner.src
      }));
    };
    fetchData();
  }, [hotel]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Name should be atleast 3 characters')
      .max(25, 'Name should be atmost 25 characters')
      .required('Name is required'),
    phone: Yup.string()
      .matches(/^[6-9]\d{9}$/, 'Phone number should be a valid 10 digit number')
      .required('Phone number is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    checkIn: Yup.date()
      .min(
        new Date().toISOString().split('T')[0],
        'Check-in date should be today or later'
      )
      .max(
        new Date(new Date().setDate(new Date().getDate() + 365))
          .toISOString()
          .split('T')[0],
        `Booking can't be done for more than 1 year`
      )
      .when('checkOut', (checkOut: any, schema: any) => {
        return schema.max(
          checkOut,
          'Check-in date should be less than check-out date'
        );
      })
      .required('Check-in date is required'),
    checkOut: Yup.date()
      .min(
        new Date().toISOString().split('T')[0],
        'Check-out date should be today or later'
      )
      .max(
        new Date(new Date().setDate(new Date().getDate() + 365))
          .toISOString()
          .split('T')[0],
        `Booking can't be done for more than 1 year`
      )
      .required('Check-out date is required'),
    guests: Yup.number()
      .min(1, 'Atleast 1 guest is should be there')
      .max(20, 'Maximum 20 guests are allowed')
      .required('Invalid guests count'),
    rooms: Yup.number()
      .min(1, 'Atleast 1 room is should be there')
      .max(10, 'Maximum 10 rooms are allowed')
      .required('Invalid rooms count')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split('T')[0],
      guests: 1,
      rooms: 1,
      hotel: '',
      to: '',
      hotelPhone: '',
      image: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await fetch('/api/mail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });
        submittedModal.onOpenChange();
      } catch (error) {
        toast.error('Failed to book room');
        console.error(error);
      }
    }
  });

  return (
    <>
      <div className="mx-auto flex max-w-6xl flex-col justify-center gap-4 p-4 md:flex-row">
        <Card
          as={'form'}
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
          className="flex-1 rounded-3xl p-2 sm:p-6"
        >
          <CardHeader className="flex-col items-start gap-4">
            <span className="text-primary">Get in Touch</span>
            <h1 className="text-3xl">Book a room at {formik.values.hotel}</h1>
            <p className="text-sm text-default-500">
              Want a stay at {formik.values.hotel}? Fill the form below to book
              a room.
            </p>
          </CardHeader>
          <Divider />
          <CardBody className="grid grid-cols-2 gap-4">
            <Input
              label="Guest Name"
              name="name"
              className="col-span-2"
              labelPlacement="outside"
              startContent={
                <Icon
                  className="text-[#a1a1aa]"
                  icon="mynaui:user-solid"
                  fontSize={22}
                />
              }
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.name && formik.errors.name ? true : false
              }
              errorMessage={formik.errors.name}
            />
            <Input
              label="Phone Number"
              name="phone"
              className="col-span-2"
              labelPlacement="outside"
              startContent={<p className="text-sm">+91</p>}
              value={formik.values.phone}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.phone && formik.errors.phone ? true : false
              }
              errorMessage={formik.errors.phone}
            />
            <Input
              label="Email"
              name="email"
              className="col-span-2"
              labelPlacement="outside"
              startContent={
                <Icon
                  className="text-[#a1a1aa]"
                  icon="fluent:mail-24-filled"
                  fontSize={22}
                />
              }
              value={formik.values.email}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.email && formik.errors.email ? true : false
              }
              errorMessage={formik.errors.email}
            />
            <I18nProvider locale="en-IN">
              <DatePicker
                label="Check - in"
                labelPlacement="outside"
                value={parseDate(formik.values.checkIn)}
                minValue={today(getLocalTimeZone())}
                onChange={(date) => {
                  formik.setFieldValue(
                    'checkIn',
                    date.toString().split('T')[0]
                  );
                }}
                className="col-span-2 sm:col-span-1"
                maxValue={today(getLocalTimeZone()).add({ years: 1 })}
                showMonthAndYearPickers
                isInvalid={
                  formik.touched.checkIn && formik.errors.checkIn ? true : false
                }
                errorMessage={formik.errors.checkIn}
              />

              <DatePicker
                label="Check - out"
                labelPlacement="outside"
                value={parseDate(formik.values.checkOut)}
                minValue={today(getLocalTimeZone())}
                onChange={(date) => {
                  formik.setFieldValue(
                    'checkOut',
                    date.toString().split('T')[0]
                  );
                }}
                className="col-span-2 sm:col-span-1"
                maxValue={today(getLocalTimeZone()).add({ years: 1 })}
                showMonthAndYearPickers
                isInvalid={
                  formik.touched.checkOut && formik.errors.checkOut
                    ? true
                    : false
                }
                errorMessage={formik.errors.checkOut}
              />
            </I18nProvider>
            <Input
              label="Guests"
              type="number"
              labelPlacement="outside"
              startContent={
                <Icon
                  className="text-[#a1a1aa]"
                  icon="mynaui:users-solid"
                  fontSize={22}
                />
              }
              min={1}
              maxLength={2}
              max={20}
              name="guests"
              className="col-span-2 sm:col-span-1"
              value={formik.values.guests as any}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.guests && formik.errors.guests ? true : false
              }
              errorMessage={formik.errors.guests}
            />
            <Input
              label="Rooms"
              type="number"
              labelPlacement="outside"
              className="col-span-2 sm:col-span-1"
              startContent={
                <Icon
                  className="text-[#a1a1aa]"
                  icon="mynaui:building-solid"
                  fontSize={22}
                />
              }
              name="rooms"
              value={formik.values.rooms as any}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.rooms && formik.errors.rooms ? true : false
              }
              errorMessage={formik.errors.rooms}
            />
            <Button
              className="col-span-2"
              type="submit"
              color="primary"
              radius="full"
              isLoading={formik.isSubmitting}
            >
              Book Room
            </Button>
          </CardBody>
        </Card>
        <div className="flex flex-1 flex-col gap-4">
          {formik.values.image ? (
            <Image
              className="h-full w-full rounded-3xl object-cover"
              src={formik.values.image || '/banner.png'}
              alt="hotel"
              width={500}
              height={300}
            />
          ) : (
            <Skeleton className="h-full rounded-3xl before:!duration-1000">
              <div className="h-24 rounded-lg bg-default-300"></div>
            </Skeleton>
          )}
          <Card className="flex-col gap-2 overflow-visible rounded-3xl p-4">
            <a
              href={`mailto:${formik.values.to}`}
              className="flex items-center gap-4 rounded-2xl bg-default-100 p-4 transition-all hover:bg-default-200"
            >
              {formik.values.hotel ? (
                <Icon
                  icon="fluent:mail-24-filled"
                  className="size-10 rounded-full bg-primary-100 p-2 text-primary"
                />
              ) : (
                <Skeleton className="size-10 rounded-full bg-primary-100 p-2 text-primary before:!duration-1000"></Skeleton>
              )}
              <div className="flex flex-col gap-2">
                {formik.values.hotel ? (
                  <>
                    <h3 className="text-lg">Email</h3>
                    <p className="text-default-700">{formik.values.to}</p>
                  </>
                ) : (
                  <>
                    <Skeleton className="h-5 w-16 rounded-lg bg-default-300 before:!duration-1000" />
                    <Skeleton className="h-3 w-36 rounded-lg bg-default-300 before:!duration-1000" />
                  </>
                )}
              </div>
            </a>

            <a
              href={`tel:${formik.values.hotelPhone}`}
              className="flex items-center gap-4 rounded-2xl bg-default-100 p-4 transition-all hover:bg-default-200"
            >
              {formik.values.hotel ? (
                <Icon
                  icon="fluent:mail-24-filled"
                  className="size-10 rounded-full bg-primary-100 p-2 text-primary"
                />
              ) : (
                <Skeleton className="size-10 rounded-full bg-primary-100 p-2 text-primary before:!duration-1000"></Skeleton>
              )}
              <div className="flex flex-col gap-2">
                {formik.values.hotel ? (
                  <>
                    <h3 className="text-lg">Phone</h3>
                    <p className="text-default-700">
                      {formik.values.hotelPhone}
                    </p>
                  </>
                ) : (
                  <>
                    <Skeleton className="h-5 w-16 rounded-lg bg-default-300 before:!duration-1000" />
                    <Skeleton className="h-3 w-36 rounded-lg bg-default-300 before:!duration-1000" />
                  </>
                )}
              </div>
            </a>
          </Card>
        </div>
      </div>
      <Modal
        isOpen={submittedModal.isOpen}
        onOpenChange={submittedModal.onOpenChange}
        backdrop="blur"
        radius="lg"
        className="rounded-3xl"
      >
        <ModalContent className="px-4">
          {(onClose) => (
            <>
              <ModalHeader className="mt-8 flex flex-col items-center gap-1">
                <Icon
                  fontSize={50}
                  icon="tabler:circle-check-filled"
                  className="mb-4 text-success"
                />
                <h2 className="text-xl leading-[20px]">Request Submitted</h2>
                <p className="text-center text-[12px] text-default-500">
                  Your request has been submitted successfully.
                </p>
              </ModalHeader>
              <ModalBody className="mb-4 rounded-2xl bg-default-100 p-4">
                <h3 className="text-sm uppercase">What&apos;s next?</h3>
                <p className="text-sm text-foreground-500">
                  We will get back to you within 24 hours. In the meantime, you
                  can explore{' '}
                  <a
                    href={`/${slugify(formik.values.hotel, { lower: true })}`}
                    className="capitalize text-primary hover:underline"
                  >
                    {formik.values.hotel}
                  </a>{' '}
                  to get more information.
                </p>
                <Button
                  variant="bordered"
                  as={Link}
                  href="/"
                  color="primary"
                  size="lg"
                >
                  Go to Home
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
