'use client';
import { isImage } from '@/functions/utility';
import { Hotel } from '@/lib/interface';
import { Weather } from '@/lib/weather';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  DateInput,
  DatePicker,
  Input
} from '@nextui-org/react';
import { useFormik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { I18nProvider } from '@react-aria/i18n';
import { parseDate, getLocalTimeZone, today } from '@internationalized/date';
import * as Yup from 'yup';
import { toast } from 'sonner';

interface Props {
  hotel: Hotel;
  weather: Weather;
}
export default function Banner({ hotel, weather }: Props) {
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
      hotel: hotel.name,
      to: hotel.email
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
        formik.resetForm();
        toast.success('Request sent successfully');
      } catch (error) {
        toast.error('Failed to book room');
        console.error(error);
      }
    }
  });

  return (
    <div>
      <div className="relative flex min-h-screen overflow-y-hidden">
        {isImage(hotel.banner.src) ? (
          <Image
            src={hotel.banner.src}
            className="absolute top-0 aspect-video min-h-screen w-full object-cover"
            loading="lazy"
            width={1500}
            height={800}
            alt="banner"
          />
        ) : (
          <div
            className="absolute inset-0 left-0 top-0 min-h-screen object-cover"
            style={{
              background: `url(${hotel.banner.src}) no-repeat center center/cover`
            }}
          ></div>
        )}

        <div
          className="absolute inset-0 left-0 top-0 min-h-screen object-cover"
          style={{
            background:
              'radial-gradient(circle, rgba(63,94,251,0) 0%, rgba(15,15,15,1) 100%)'
          }}
        ></div>
        <div className="relative flex flex-col items-center justify-center gap-12 px-4 pb-4 text-white md:px-12 lg:flex-row lg:justify-between">
          <div className="flex flex-col pt-8 lg:max-w-[50%]">
            <div className="mb-8">
              <Button
                radius="full"
                color="primary"
                size="lg"
                startContent={
                  <img
                    alt="weather"
                    width={24}
                    height={24}
                    src={weather?.current.condition.icon}
                    className="size-6"
                  />
                }
                as={Link}
                href={`https://weather.com/weather/today/l/${weather?.location.lat},${weather?.location.lon}?par=apple`}
                target="_blank"
              >
                {parseInt(weather?.current?.temp_c as any)}&deg;C
              </Button>
            </div>
            <h3
              className="text-3xl !leading-tight sm:text-5xl lg:text-6xl"
              dangerouslySetInnerHTML={{
                __html:
                  hotel.banner.text ||
                  'Where You Get <span class="text-primary">Trapped:</span> in the Beauty of the World and  <span class="text-primary">Unforgettable</span> Happiness!'
              }}
            />
          </div>
          <Card
            as={'form'}
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
            className="flex w-full flex-col rounded-3xl bg-white p-4 text-black lg:max-w-sm"
          >
            <CardHeader>
              <Icon icon="tabler:bed" fontSize={20} className="mr-4" />
              Book Rooms in {hotel.name}
            </CardHeader>
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
                  maxValue={today(getLocalTimeZone()).add({ years: 1 })}
                  showMonthAndYearPickers
                  isInvalid={
                    formik.touched.checkIn && formik.errors.checkIn
                      ? true
                      : false
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
        </div>
      </div>
    </div>
  );
}
