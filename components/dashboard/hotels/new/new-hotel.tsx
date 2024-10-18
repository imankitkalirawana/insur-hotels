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
  Link,
  Progress,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@nextui-org/react';
import { IconPencil } from '@tabler/icons-react';
import axios from 'axios';
import { useFormik } from 'formik';
import React from 'react';
import slugify from 'slugify';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { PHOTOMAXSIZE } from '@/lib/config';

export default function NewHotel() {
  const [stepCount, setStepCount] = React.useState(0);
  const [progressMessage, setProgressMessage] = React.useState('');
  const router = useRouter();

  const validationSchema = Yup.object({
    name: Yup.string().required('Please enter hotel name'),
    description: Yup.string().required('Please enter hotel description'),
    address: Yup.string().required('Please enter hotel address'),
    location: Yup.string().required('Please enter hotel location')
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      address: '',
      src: '',
      url: '',
      slugPreview: '',
      status: 'open',
      location: '',
      banner: {
        text: '',
        src: '',
        preview: '',
        file: new File([''], '', { type: 'image/jpeg' })
      },
      premiumFacilities: Array.from({ length: 4 }, () => ({
        name: '',
        description: '',
        src: '',
        previewImg: '',
        file: new File([''], '', { type: 'image/jpeg' })
      })),
      otherFacilities: Array.from({ length: 6 }, () => ({
        name: '',
        description: '',
        src: '',
        previewImg: '',
        file: new File([''], '', { type: 'image/jpeg' })
      })),
      thumbnailPreview: '',
      thumbnail: new File([''], '', { type: 'image/jpeg' })
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (values.thumbnailPreview) {
          setProgressMessage('Uploading thumbnail');
          const filename = `hotels/${slugify(values.name.toLowerCase())}/src.${values.thumbnail.name.split('.').pop()}`;
          const formData = new FormData();
          formData.append('file', values.thumbnail);
          formData.append('filename', filename);
          await fetch(`/api/s3-upload`, {
            method: 'POST',
            body: formData
          }).then(async (res) => {
            const data = await res.json();
            values.src = data.url;
            setStepCount((prevCount) => prevCount + 1);
          });
        }

        if (values.banner.preview) {
          setProgressMessage('Uploading banner');
          const filename = `hotels/${slugify(values.name.toLowerCase())}/banner.${values.banner.file.name.split('.').pop()}`;
          const formData = new FormData();
          formData.append('file', values.banner.file);
          formData.append('filename', filename);
          await fetch(`/api/s3-upload`, {
            method: 'POST',
            body: formData
          }).then(async (res) => {
            const data = await res.json();
            values.banner.src = data.url;
            setStepCount((prevCount) => prevCount + 1);
          });
        }

        if (values.premiumFacilities.length > 0) {
          setProgressMessage('Uploading premium facilities');
          for (let i = 0; i < values.premiumFacilities.length; i++) {
            if (values.premiumFacilities[i].previewImg) {
              const filename = `hotels/${slugify(values.name.toLowerCase())}/premium-facilities/premium-facility-${i}.${values.premiumFacilities[i].file.name.split('.').pop()}`;
              const formData = new FormData();
              formData.append('file', values.premiumFacilities[i].file);
              formData.append('filename', filename);
              await fetch(`/api/s3-upload`, {
                method: 'POST',
                body: formData
              }).then(async (res) => {
                const data = await res.json();
                values.premiumFacilities[i].src = data.url;
              });
            }
          }
          setStepCount((prevCount) => prevCount + 1);
        }
        if (values.otherFacilities.length > 0) {
          setProgressMessage('Uploading other facilities');
          for (let i = 0; i < values.otherFacilities.length; i++) {
            if (values.otherFacilities[i].previewImg) {
              const filename = `hotels/${slugify(values.name.toLowerCase())}/other-facilities/other-facility-${i}.${values.otherFacilities[i].file.name.split('.').pop()}`;
              const formData = new FormData();
              formData.append('file', values.otherFacilities[i].file);
              formData.append('filename', filename);
              await fetch(`/api/s3-upload`, {
                method: 'POST',
                body: formData
              }).then(async (res) => {
                const data = await res.json();
                values.otherFacilities[i].src = data.url;
              });
            }
          }
          setStepCount((prevCount) => prevCount + 1);
        }
        const res = await axios.post('/api/hotels', values);
        toast.success(res.data.message);
        router.push('/dashboard/hotels');
      } catch (error: any) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Something went wrong');
      }
    }
  });

  return (
    <>
      <div>
        <form onSubmit={formik.handleSubmit} className="mt-6">
          <dl>
            <div className="mt-4 px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Add New Hotel
              </h3>
              <p className="max-w-2xl text-sm leading-6 text-gray-500">
                Fill the form below details to add a new hotel.
              </p>
            </div>
          </dl>
          <div className="flex gap-4 py-4">
            <input
              id="thumbnailPreview"
              name="thumbnailPreview"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const selectedFile: File = e.target.files[0];
                  if (selectedFile.size > PHOTOMAXSIZE) {
                    toast.error(`Image size should be less than 1MB`);
                    return;
                  }
                  formik.setFieldValue('thumbnail', selectedFile);
                  const reader = new FileReader();
                  reader.onload = () => {
                    const imageData = reader.result as string;
                    formik.setFieldValue('thumbnailPreview', imageData);
                  };
                  reader.readAsDataURL(selectedFile);
                }
              }}
            />
            <Badge
              classNames={{
                badge: 'w-5 h-5'
              }}
              color="primary"
              content={
                <Button
                  isIconOnly
                  className="p-0 text-primary-foreground"
                  radius="full"
                  size="sm"
                  variant="light"
                  as={'label'}
                  htmlFor="thumbnailPreview"
                >
                  <IconPencil size={12} />
                </Button>
              }
              placement="bottom-right"
              shape="circle"
            >
              <Avatar
                className="h-14 w-14"
                src={formik.values.thumbnailPreview}
              />
            </Badge>
          </div>
          <p className="text-small text-default-400">
            This image will be used as the thumbnail image for the hotel.
          </p>
          <dl>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Name</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  name="name"
                  placeholder="eg: Seraibagh"
                  value={formik.values.name}
                  onChange={(e) => {
                    formik.setFieldValue('name', e.target.value);
                    formik.setFieldValue(
                      'slugPreview',
                      slugify(e.target.value.toLowerCase())
                    );
                  }}
                  description={
                    <>
                      {formik.values.slugPreview && (
                        <span>
                          Hotel ID: <b>{formik.values.slugPreview}</b>. It
                          cannot be changed later.
                        </span>
                      )}
                    </>
                  }
                  isInvalid={
                    formik.touched.name && formik.errors.name ? true : false
                  }
                  errorMessage={formik.errors.name}
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
              <dt className="text-sm font-medium leading-6">Location</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  name="location"
                  value={formik.values.location}
                  placeholder="eg: Ranthambore, Rajasthan"
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.location && formik.errors.location
                      ? true
                      : false
                  }
                  errorMessage={formik.errors.location}
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Full Address</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Textarea
                  name="address"
                  value={formik.values.address}
                  placeholder="eg: Village Sherpur, Sawai Madhopur, Rajasthan"
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.address && formik.errors.address
                      ? true
                      : false
                  }
                  errorMessage={formik.errors.address}
                />
              </dd>
            </div>
          </dl>
          <Divider />
          <dl>
            <div className="mt-4 px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Banner
              </h3>
              <p className="max-w-2xl text-sm leading-6 text-gray-500">
                Upload or enter a custom banner text for your hotel.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 py-4">
              <div className="relative w-96 rounded-2xl">
                <input
                  id="banner-src"
                  name="banner-src"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const selectedFile: File = e.target.files[0];
                      if (selectedFile.size > PHOTOMAXSIZE) {
                        toast.error(`Image size should be less than 1MB`);
                        return;
                      }
                      formik.setFieldValue('banner.file', selectedFile);
                      const reader = new FileReader();
                      reader.onload = () => {
                        const imageData = reader.result as string;
                        formik.setFieldValue('banner.preview', imageData);
                      };
                      reader.readAsDataURL(selectedFile);
                    }
                  }}
                />
                {formik.values.banner.preview ? (
                  <>
                    <Image
                      src={formik.values.banner.preview}
                      className="aspect-video rounded-2xl object-cover"
                      alt={formik.values.banner.text}
                    />
                    <label
                      htmlFor="banner-src"
                      className="absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-2xl opacity-0 transition-all hover:bg-black/30 hover:opacity-100"
                    >
                      <IconPencil size={56} className="text-white" />
                    </label>
                  </>
                ) : (
                  <label
                    htmlFor="banner-src"
                    className="inset-0 z-10 flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-default bg-white transition-all"
                  >
                    <Link as={'span'}>Select an image</Link>
                  </label>
                )}
              </div>
              <Input
                name="banner.text"
                value={formik.values.banner.text}
                onChange={formik.handleChange}
                placeholder="Enter text that will be displayed on the banner"
                type="text"
                variant="bordered"
                label="Banner Text"
              />
            </div>
          </dl>
          <Divider />
          <dl>
            <div className="mt-4 px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Premium Facilities
              </h3>
              <p className="max-w-2xl text-sm leading-6 text-gray-500">
                Add premium facilities available at the hotel.
              </p>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {formik.values.premiumFacilities
                .slice(0, 4)
                .map((item, index) => (
                  <div key={index} className="flex max-w-xs flex-col">
                    <div className="relative rounded-2xl bg-default">
                      <input
                        id={`premium-facility-photo-${index}`}
                        name={`premium-facility-photo-${index}`}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          console.log('file found');
                          if (e.target.files && e.target.files[0]) {
                            const selectedFile: File = e.target.files[0];
                            if (selectedFile.size > PHOTOMAXSIZE) {
                              toast.error(`Image size should be less than 1MB`);
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                              const imageData = reader.result as string;
                              formik.setFieldValue(
                                `premiumFacilities[${index}].file`,
                                selectedFile
                              );
                              formik.setFieldValue(
                                `premiumFacilities[${index}].previewImg`,
                                imageData
                              );
                            };
                            reader.readAsDataURL(selectedFile);
                          }
                        }}
                      />
                      {item.previewImg ? (
                        <>
                          <Image
                            src={item.previewImg}
                            className="aspect-video rounded-2xl object-cover"
                            alt={formik.values.premiumFacilities[index].name}
                          />
                          <label
                            htmlFor={`premium-facility-photo-${index}`}
                            className="absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-2xl opacity-0 transition-all hover:bg-black/30 hover:opacity-100"
                          >
                            <IconPencil size={56} className="text-white" />
                          </label>
                        </>
                      ) : (
                        <label
                          htmlFor={`premium-facility-photo-${index}`}
                          className="inset-0 z-10 flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-default bg-white transition-all"
                        >
                          <Link as={'span'}>Select an image</Link>
                        </label>
                      )}
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                      <Input
                        label="Title"
                        name="name"
                        size="sm"
                        value={formik.values.premiumFacilities[index].name}
                        onChange={(e) => {
                          formik.setFieldValue(
                            `premiumFacilities[${index}].name`,
                            e.target.value
                          );
                        }}
                      />
                      <Input
                        label="Description"
                        value={
                          formik.values.premiumFacilities[index].description
                        }
                        name="description"
                        onChange={(e) => {
                          formik.setFieldValue(
                            `premiumFacilities[${index}].description`,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </dl>
          <Divider className="my-8" />
          <dl>
            <div className="mt-4 px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Other Facilities
              </h3>
              <p className="max-w-2xl text-sm leading-6 text-gray-500">
                Add other facilities available at the hotel.
              </p>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {formik.values.otherFacilities.slice(0, 6).map((item, index) => (
                <div key={index} className="flex max-w-xs flex-col">
                  <div className="relative aspect-square rounded-full bg-default">
                    <input
                      id={`other-facility-photo-${index}`}
                      name={`other-facility-photo-${index}`}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        console.log('file found');
                        if (e.target.files && e.target.files[0]) {
                          const selectedFile: File = e.target.files[0];
                          if (selectedFile.size > PHOTOMAXSIZE) {
                            toast.error(`Image size should be less than 1MB`);
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = () => {
                            const imageData = reader.result as string;
                            formik.setFieldValue(
                              `otherFacilities[${index}].file`,
                              selectedFile
                            );
                            formik.setFieldValue(
                              `otherFacilities[${index}].previewImg`,
                              imageData
                            );
                          };
                          reader.readAsDataURL(selectedFile);
                        }
                      }}
                    />
                    {item.previewImg ? (
                      <>
                        <Image
                          src={item.previewImg}
                          className="aspect-square rounded-full object-cover"
                          alt={formik.values.otherFacilities[index].name}
                        />
                        <label
                          htmlFor={`other-facility-photo-${index}`}
                          className="absolute inset-0 z-10 flex aspect-square h-full w-full items-center justify-center rounded-full opacity-0 transition-all hover:bg-black/30 hover:opacity-100"
                        >
                          <IconPencil size={56} className="text-white" />
                        </label>
                      </>
                    ) : (
                      <label
                        htmlFor={`other-facility-photo-${index}`}
                        className="inset-0 z-10 flex aspect-square w-full items-center justify-center rounded-full border border-dashed border-default bg-white transition-all"
                      >
                        <Link as={'span'}>Select an image</Link>
                      </label>
                    )}
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <Input
                      label="Title"
                      name="name"
                      size="sm"
                      value={formik.values.otherFacilities[index].name}
                      onChange={(e) => {
                        formik.setFieldValue(
                          `otherFacilities[${index}].name`,
                          e.target.value
                        );
                      }}
                    />
                    {/* <Input
                      label="Description"
                      value={formik.values.otherFacilities[index].description}
                      name="description"
                      onChange={(e) => {
                        formik.setFieldValue(
                          `otherFacilities[${index}].description`,
                          e.target.value
                        );
                      }}
                    /> */}
                  </div>
                </div>
              ))}
            </div>
          </dl>

          <div className="flex items-center justify-end py-4">
            <Button
              type="submit"
              color="primary"
              endContent={<Icon icon="tabler:check" />}
              isLoading={formik.isSubmitting}
            >
              Add Hotel
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
