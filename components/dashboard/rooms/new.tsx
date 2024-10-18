'use client';

import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Input,
  Image,
  Textarea,
  Button,
  Avatar,
  Badge,
  Divider,
  Link as NextLink,
  Progress,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Chip
} from '@nextui-org/react';
import { IconPencil, IconPlus, IconX } from '@tabler/icons-react';
import { useFormik } from 'formik';
import React from 'react';
import slugify from 'slugify';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { Hotel, RoomType } from '@/lib/interface';
import Link from 'next/link';
import { PHOTOMAXSIZE } from '@/lib/config';

interface Props {
  hotels: Hotel[];
  roomType: RoomType[];
}

export default function NewRoom({ hotels, roomType }: Props) {
  const [stepCount, setStepCount] = React.useState(0);
  const [progressMessage, setProgressMessage] = React.useState('');
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    hotelId: Yup.string().required('Hotel is required'),
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number()
      .min(100, 'Price must be atleast ₹100')
      .required('Price is required'),
    discount: Yup.object().shape({
      type: Yup.string()
        .oneOf(['percentage', 'flat'], 'Discount Type is required')
        .required('Discount Type is required'),
      value: Yup.number()
        .min(0, 'Discount Value must be atleast 0')
        .required('Discount Value is required')
    }),
    type: Yup.string().required('Room Type is required')
  });

  const formik = useFormik({
    initialValues: {
      hotelId: '',
      title: '',
      description: '',
      price: 100,
      size: 0,
      discount: { type: 'percentage', value: 0 },
      maxGuests: 0,
      type: '',
      available: true,
      images: [
        {
          src: '',
          preview: '',
          file: new File([''], '', { type: 'image/jpeg' })
        }
      ],
      popularWithGuests: [],
      roomFeatures: [],
      safetyFeatures: [],
      bathroomFeatures: [],
      otherFeatures: []
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (values.images.length > 0 && values.images[0].preview) {
          setProgressMessage('Uploading files...');
          for (let i = 0; i < values.images.length; i++) {
            if (values.images[i].preview) {
              let filename = `hotels/${values.hotelId}/rooms/${slugify(values.title, { lower: true })}/room-${new Date().getTime()}.${values.images[i].file?.name.split('.').pop()}`;
              const formData = new FormData();
              formData.append('file', values.images[i].file);
              formData.append('filename', filename);
              await fetch(`/api/s3-upload`, {
                method: 'POST',
                body: formData
              }).then(async (res) => {
                const data = await res.json();
                values.images[i].src = data.url;
                setStepCount((prev) => prev + 1);
              });
            }
          }
        }
        await fetch('/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });
        toast.success('Room added successfully');
        router.push('/dashboard/rooms');
      } catch (error: any) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Something went wrong');
      }
    }
  });

  const handleAddImage = () => {
    formik.setFieldValue('images', [
      ...formik.values.images,
      {
        src: '',
        preview: '',
        file: null
      }
    ]);
  };

  const handleDeleteImage = (index: number) => {
    formik.setFieldValue(
      'images',
      formik.values.images.filter((_, i) => i !== index)
    );
  };

  return (
    <>
      <div>
        <form onSubmit={formik.handleSubmit} className="mt-6">
          <dl>
            <div className="mt-4 px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Add New Room
              </h3>
              <p className="max-w-2xl text-sm leading-6 text-gray-500">
                Add a new room to your hotel
              </p>
            </div>
          </dl>

          <dl>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Hotel</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Select
                  name="hotelId"
                  value={formik.values.hotelId}
                  onChange={formik.handleChange}
                  placeholder="Select Hotel"
                  selectedKeys={[formik.values.hotelId]}
                  isInvalid={
                    formik.touched.hotelId && formik.errors.hotelId
                      ? true
                      : false
                  }
                  errorMessage={formik.errors.hotelId}
                >
                  {hotels.map((type) => (
                    <SelectItem key={type.slug}>{type.name}</SelectItem>
                  ))}
                </Select>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Name</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  name="title"
                  placeholder="eg: Deluxe Room"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.title && formik.errors.title ? true : false
                  }
                  errorMessage={formik.errors.title}
                />
              </dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Description</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Textarea
                  name="description"
                  placeholder="eg: A luxury resort in the heart of Ranthambore"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.description && formik.errors.description
                      ? true
                      : false
                  }
                  errorMessage={formik.errors.description}
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Area</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  name="size"
                  value={
                    formik.values.size !== undefined
                      ? String(formik.values.size)
                      : ''
                  }
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : '';
                    formik.setFieldValue('size', value);
                  }}
                  isInvalid={
                    formik.touched.size && formik.errors.size ? true : false
                  }
                  errorMessage={formik.errors.size}
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-small text-default-400">sq.ft</span>
                    </div>
                  }
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Price</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  name="price"
                  value={
                    formik.values.price !== undefined
                      ? String(formik.values.price)
                      : ''
                  }
                  type="number"
                  min={100}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : '';
                    formik.setFieldValue('price', value);
                  }}
                  isInvalid={
                    formik.touched.price && formik.errors.price ? true : false
                  }
                  errorMessage={formik.errors.price}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-small text-default-400">₹</span>
                    </div>
                  }
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Discount</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  name="discount.value"
                  type="number"
                  min={0}
                  value={
                    formik.values.discount !== undefined
                      ? String(formik.values.discount.value)
                      : ''
                  }
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : '';
                    formik.setFieldValue('discount.value', value);
                  }}
                  isInvalid={
                    formik.touched.discount?.value &&
                    formik.errors.discount?.value
                      ? true
                      : false
                  }
                  errorMessage={formik.errors.discount?.value}
                  endContent={
                    <select
                      className="border-0 bg-transparent text-small text-default-400 outline-none"
                      name="discount.type"
                      value={formik.values.discount.type}
                      onChange={formik.handleChange}
                    >
                      <option value="percentage">%</option>
                      <option value="flat">₹</option>
                    </select>
                  }
                  description={`Effective Price: ₹${formik.values.discount.type === 'percentage' ? (formik.values.price - (formik.values.price * formik.values.discount.value) / 100).toLocaleString('en-IN') : (formik.values.price - formik.values.discount.value).toLocaleString('en-IN')}`}
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Room Type</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Select
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  selectedKeys={[formik.values.type]}
                  placeholder="Select Room Type"
                  description={
                    <>
                      To add more room types{' '}
                      <Link
                        href="/dashboard/room-types"
                        className="underline hover:text-primary"
                      >
                        Click Here
                      </Link>
                      .
                    </>
                  }
                >
                  {roomType.map((type) => (
                    <SelectItem key={type.rid}>{type.name}</SelectItem>
                  ))}
                </Select>
              </dd>
            </div>
          </dl>

          <Divider className="my-8" />
          <dl>
            <div className="px-4 py-6 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Room Images
              </h3>
              <p className="max-w-2xl text-sm leading-6 text-gray-500">
                Upload images of the room
              </p>
            </div>
          </dl>
          <dl>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {formik.values.images.map((item, index) => (
                <div
                  key={index}
                  className="group relative flex max-w-xs flex-col"
                >
                  <Button
                    variant="flat"
                    color="danger"
                    size="sm"
                    className="absolute -right-2 -top-2 z-50 hidden group-hover:flex"
                    onClick={() => handleDeleteImage(index)}
                    isIconOnly
                    radius="full"
                  >
                    <IconX size={18} />
                  </Button>
                  <div className="relative w-full rounded-2xl bg-default">
                    <input
                      id={`image-photo-${index}`}
                      name={`image-photo-${index}`}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const selectedFile: File = e.target.files[0];
                          if (selectedFile.size > PHOTOMAXSIZE) {
                            toast.error('Image size should be less than 1MB');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = () => {
                            const imageData = reader.result as string;
                            formik.setFieldValue(
                              `images[${index}].file`,
                              selectedFile
                            );
                            formik.setFieldValue(
                              `images[${index}].preview`,
                              imageData
                            );
                          };
                          reader.readAsDataURL(selectedFile);
                        }
                      }}
                    />
                    {formik.values.images[index].src ||
                    formik.values.images[index].preview ? (
                      <>
                        <Image
                          src={
                            formik.values.images[index].preview
                              ? formik.values.images[index].preview
                              : item.src
                          }
                          className="aspect-square w-full rounded-2xl object-cover"
                          alt="image"
                        />
                        <label
                          htmlFor={`image-photo-${index}`}
                          className="absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-2xl opacity-0 transition-all hover:bg-black/30 hover:opacity-100"
                        >
                          <IconPencil size={36} className="text-white" />
                        </label>
                      </>
                    ) : (
                      <label
                        htmlFor={`image-photo-${index}`}
                        className="inset-0 z-10 flex aspect-square w-full items-center justify-center rounded-2xl border border-dashed border-default bg-white transition-all"
                      >
                        <NextLink as={'span'}>Select an image</NextLink>
                      </label>
                    )}
                  </div>
                </div>
              ))}
              {formik.values.images.length < 15 && (
                <div className="relative flex aspect-square w-full max-w-xs flex-col rounded-2xl border border-dashed border-default-500">
                  <div className="ga-2 absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center">
                    <Button
                      variant="flat"
                      color="primary"
                      size="lg"
                      onClick={handleAddImage}
                      isIconOnly
                      radius="full"
                    >
                      <IconPlus size={24} />
                    </Button>
                    <NextLink className="whitespace-nowrap text-center">
                      Add New
                    </NextLink>
                  </div>
                </div>
              )}
            </div>
          </dl>
          <Divider className="my-8" />
          <dl>
            <div className="px-4 py-6 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Popular with Guests
              </h3>
              <p className="max-w-2xl text-sm leading-6 text-gray-500">
                Add amenities popular with guests
              </p>
            </div>
          </dl>
          <dl>
            <div className="mt-2">
              <Input
                name="popularWithGuests"
                placeholder="eg: Free WiFi, Breakfast, etc."
                value={formik.values.popularWithGuests.join(',')}
                onChange={(e) => {
                  formik.setFieldValue(
                    'popularWithGuests',
                    e.target.value.split(',').map((item) => item)
                  );
                }}
                description="Separate each amenity with a comma"
                isInvalid={
                  formik.touched.popularWithGuests &&
                  formik.errors.popularWithGuests
                    ? true
                    : false
                }
                errorMessage={formik.errors.popularWithGuests}
              />
              <div className="my-2 flex flex-wrap items-center gap-2">
                {formik.values.popularWithGuests.map(
                  (item, index) =>
                    item && (
                      <Chip
                        key={index}
                        variant="flat"
                        className="cursor-pointer hover:bg-danger-100"
                        endContent={
                          <Icon icon="solar:close-circle-bold" fontSize={20} />
                        }
                        onClick={() => {
                          formik.setFieldValue(
                            'popularWithGuests',
                            formik.values.popularWithGuests.filter(
                              (_, i) => i !== index
                            )
                          );
                        }}
                      >
                        {item}
                      </Chip>
                    )
                )}
              </div>
            </div>
          </dl>
          <Divider className="my-8" />
          <dl>
            <div className="px-4 py-6 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Room Features
              </h3>
              <p className="max-w-2xl text-sm leading-6 text-gray-500">
                Add room features
              </p>
            </div>
          </dl>
          <dl>
            <div className="mt-2">
              <Input
                name="roomFeatures"
                placeholder="eg: Air Conditioning, TV, etc."
                value={formik.values.roomFeatures.join(',')}
                onChange={(e) => {
                  formik.setFieldValue(
                    'roomFeatures',
                    e.target.value.split(',').map((item) => item)
                  );
                }}
                description="Separate each feature with a comma"
              />
              <div className="my-2 flex flex-wrap items-center gap-2">
                {formik.values.roomFeatures.map(
                  (item, index) =>
                    item && (
                      <Chip
                        key={index}
                        variant="flat"
                        className="cursor-pointer hover:bg-danger-100"
                        endContent={
                          <Icon icon="solar:close-circle-bold" fontSize={20} />
                        }
                        onClick={() => {
                          formik.setFieldValue(
                            'roomFeatures',
                            formik.values.roomFeatures.filter(
                              (_, i) => i !== index
                            )
                          );
                        }}
                      >
                        {item}
                      </Chip>
                    )
                )}
              </div>
            </div>
          </dl>
          <Divider className="my-8" />
          <dl>
            <div className="px-4 py-6 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Safety Features
              </h3>
              <p className="max-w-2xl text-sm leading-6 text-gray-500">
                Add safety features
              </p>
            </div>
          </dl>
          <dl>
            <div className="mt-2">
              <Input
                name="safetyFeatures"
                placeholder="eg: Fire Extinguisher, CCTV, etc."
                value={formik.values.safetyFeatures.join(',')}
                onChange={(e) => {
                  formik.setFieldValue(
                    'safetyFeatures',
                    e.target.value.split(',').map((item) => item)
                  );
                }}
                description="Separate each feature with a comma"
              />
              <div className="my-2 flex flex-wrap items-center gap-2">
                {formik.values.safetyFeatures.map(
                  (item, index) =>
                    item && (
                      <Chip
                        key={index}
                        variant="flat"
                        className="cursor-pointer hover:bg-danger-100"
                        endContent={
                          <Icon icon="solar:close-circle-bold" fontSize={20} />
                        }
                        onClick={() => {
                          formik.setFieldValue(
                            'safetyFeatures',
                            formik.values.safetyFeatures.filter(
                              (_, i) => i !== index
                            )
                          );
                        }}
                      >
                        {item}
                      </Chip>
                    )
                )}
              </div>
            </div>
          </dl>
          <Divider className="my-8" />
          <dl>
            <div className="px-4 py-6 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Bathroom Features
              </h3>
              <p className="max-w-2xl text-sm leading-6 text-gray-500">
                Add bathroom features
              </p>
            </div>
          </dl>
          <dl>
            <div className="mt-2">
              <Input
                name="bathroomFeatures"
                placeholder="eg: Bathtub, Shower, etc."
                value={formik.values.bathroomFeatures.join(',')}
                onChange={(e) => {
                  formik.setFieldValue(
                    'bathroomFeatures',
                    e.target.value.split(',').map((item) => item)
                  );
                }}
                description="Separate each feature with a comma"
              />
              <div className="my-2 flex flex-wrap items-center gap-2">
                {formik.values.bathroomFeatures.map(
                  (item, index) =>
                    item && (
                      <Chip
                        key={index}
                        variant="flat"
                        className="cursor-pointer hover:bg-danger-100"
                        endContent={
                          <Icon icon="solar:close-circle-bold" fontSize={20} />
                        }
                        onClick={() => {
                          formik.setFieldValue(
                            'bathroomFeatures',
                            formik.values.bathroomFeatures.filter(
                              (_, i) => i !== index
                            )
                          );
                        }}
                      >
                        {item}
                      </Chip>
                    )
                )}
              </div>
            </div>
          </dl>
          <Divider className="my-8" />
          <dl>
            <div className="px-4 py-6 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Other Features
              </h3>
              <p className="max-w-2xl text-sm leading-6 text-gray-500">
                Add other features
              </p>
            </div>
          </dl>
          <dl>
            <div className="mt-2">
              <Input
                name="otherFeatures"
                placeholder="eg: Balcony, Terrace, etc."
                value={formik.values.otherFeatures.join(',')}
                onChange={(e) => {
                  formik.setFieldValue(
                    'otherFeatures',
                    e.target.value.split(',').map((item) => item)
                  );
                }}
                description="Separate each feature with a comma"
              />
              <div className="my-2 flex flex-wrap items-center gap-2">
                {formik.values.otherFeatures.map(
                  (item, index) =>
                    item && (
                      <Chip
                        key={index}
                        variant="flat"
                        className="cursor-pointer hover:bg-danger-100"
                        endContent={
                          <Icon icon="solar:close-circle-bold" fontSize={20} />
                        }
                        onClick={() => {
                          formik.setFieldValue(
                            'otherFeatures',
                            formik.values.otherFeatures.filter(
                              (_, i) => i !== index
                            )
                          );
                        }}
                      >
                        {item}
                      </Chip>
                    )
                )}
              </div>
            </div>
          </dl>

          <div className="flex items-center justify-end py-4">
            <Button
              type="submit"
              color="primary"
              endContent={<Icon icon="tabler:check" />}
              isLoading={formik.isSubmitting}
            >
              Add Room
            </Button>
          </div>
        </form>
      </div>
      <Modal
        backdrop="blur"
        scrollBehavior="inside"
        isOpen={formik.isSubmitting}
        isDismissable={false}
        hideCloseButton
        isKeyboardDismissDisabled={false}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex-col items-center">
              <Icon
                icon="tabler:cloud"
                fontSize={54}
                className="text-primary"
              />
              <h2 className="mt-4 max-w-xs text-center text-base">Uploading</h2>
            </ModalHeader>
            <ModalBody className="items-center text-sm">
              <Progress value={stepCount * 25} className="mb-4" />
              <p>{progressMessage}</p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() => {
                  formik.setSubmitting(false);
                  router.refresh();
                }}
                fullWidth
                variant="bordered"
              >
                Cancel
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
