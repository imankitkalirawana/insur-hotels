import { Hotel } from '@/lib/interface';
import {
  Button,
  Link,
  Input,
  DatePicker,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress
} from '@nextui-org/react';
import { IconX, IconPencil, IconPlus } from '@tabler/icons-react';
import { useFormik } from 'formik';
import { parseDate } from '@internationalized/date';
import { Icon } from '@iconify/react/dist/iconify.js';
import { toast } from 'sonner';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PHOTOMAXSIZE } from '@/lib/config';

interface Props {
  hotel: Hotel;
}

export default function Offers({ hotel }: Props) {
  const [stepCount, setStepCount] = React.useState(0);
  const [progressMessage, setProgressMessage] = React.useState('');
  const router = useRouter();
  const BUCKET_NAME = 'hotels';
  const formik = useFormik({
    initialValues: {
      offers: hotel.offers
    },
    onSubmit: async (values) => {
      try {
        if (values.offers.length > 0) {
          setProgressMessage('Uploading files...');
          for (let i = 0; i < values.offers.length; i++) {
            if (values.offers[i].preview) {
              let filename = `hotels/${hotel.slug}/offers/offer-${values.offers[i]._id}.${values.offers[i].file?.name.split('.').pop()}`;
              const previousFilename = `${values.offers[i].src.split('amazonaws.com/')[1]}`;
              const formData = new FormData();
              formData.append('file', values.offers[i].file);
              formData.append('filename', filename);
              await fetch(`/api/s3-upload`, {
                method: 'DELETE',
                body: JSON.stringify({ filename: previousFilename })
              });
              await fetch(`/api/s3-upload`, {
                method: 'POST',
                body: formData
              }).then(async (res) => {
                const data = await res.json();
                values.offers[i].src = data.url;
                setStepCount((prev) => prev + 1);
              });
            }
          }
        }
        await fetch(`/api/hotels/id/${hotel._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        }).then(() => {
          toast.success('Hotel updated successfully');
        });
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong');
      }
    }
  });

  const handleAddItem = () => {
    formik.setFieldValue('offers', [
      ...formik.values.offers,
      {
        title: '',
        discount: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        preview: '',
        src: ''
      }
    ]);
  };

  const handleDeleteItem = async (index: number) => {
    const updatedItem = formik.values.offers.filter((_, i) => i !== index);
    formik.setFieldValue('offers', updatedItem);
    // Remove the image from the storage
    if (formik.values.offers[index].src) {
      const filename =
        formik.values.offers[index].src.split('amazonaws.com/')[1];
      await fetch(`/api/s3-upload`, {
        method: 'DELETE',
        body: JSON.stringify({ filename })
      })
        .then(async (res) => {
          const data = await res.json();
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
          toast.error('Something went wrong');
        });
    }
  };

  return (
    <>
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Offers
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">
            Manage offers available at {hotel.name}
          </p>
        </div>
        <form onSubmit={formik.handleSubmit} className="mt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {formik.values.offers.map((item, index) => (
              <div key={index} className="group relative flex flex-col">
                <Button
                  variant="flat"
                  color="danger"
                  size="sm"
                  className="absolute -right-2 -top-2 z-50 hidden group-hover:flex"
                  onClick={() => handleDeleteItem(index)}
                  isIconOnly
                  radius="full"
                >
                  <IconX size={18} />
                </Button>
                <div className="relative w-full rounded-2xl bg-default">
                  <input
                    id={`offer-photo-${index}`}
                    name={`offer-photo-${index}`}
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
                        const reader = new FileReader();
                        reader.onload = () => {
                          const imageData = reader.result as string;
                          formik.setFieldValue(
                            `offers[${index}].file`,
                            selectedFile
                          );
                          formik.setFieldValue(
                            `offers[${index}].preview`,
                            imageData
                          );
                        };
                        reader.readAsDataURL(selectedFile);
                      }
                    }}
                  />
                  {formik.values.offers[index].src ||
                  formik.values.offers[index].preview ? (
                    <>
                      <Image
                        src={
                          formik.values.offers[index].preview
                            ? formik.values.offers[index].preview
                            : item.src
                        }
                        className="aspect-[5/2] min-h-[150px] w-full rounded-2xl object-cover"
                        alt="offer"
                        width={300}
                        height={150}
                      />
                      <label
                        htmlFor={`offer-photo-${index}`}
                        className="absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-2xl opacity-0 transition-all hover:bg-black/30 hover:opacity-100"
                      >
                        <IconPencil size={36} className="text-white" />
                      </label>
                    </>
                  ) : (
                    <label
                      htmlFor={`offer-photo-${index}`}
                      className="inset-0 z-10 flex aspect-[5/2] w-full items-center justify-center rounded-2xl border border-dashed border-default bg-white transition-all"
                    >
                      <Link as={'span'}>Select an image</Link>
                    </label>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <Input
                    label="Title"
                    value={formik.values.offers[index].title}
                    name="title"
                    size="sm"
                    onChange={(e) => {
                      formik.setFieldValue(
                        `offers[${index}].title`,
                        e.target.value
                      );
                    }}
                  />
                  <Input
                    label="Discount"
                    value={formik.values.offers[index].discount}
                    name="discount"
                    onChange={(e) => {
                      formik.setFieldValue(
                        `offers[${index}].discount`,
                        e.target.value
                      );
                    }}
                  />
                  <DatePicker
                    label="Start Date (MM-DD-YYYY)"
                    onChange={(date) => {
                      console.log(date.toString().split('T')[0]);
                      formik.setFieldValue(
                        `offers[${index}].startDate`,
                        date.toString().split('T')[0]
                      );
                    }}
                    value={parseDate(formik.values.offers[index].startDate)}
                    showMonthAndYearPickers
                  />
                  <DatePicker
                    label="End Date (MM-DD-YYYY)"
                    onChange={(date) => {
                      console.log(date.toString().split('T')[0]);
                      formik.setFieldValue(
                        `offers[${index}].endDate`,
                        date.toString().split('T')[0]
                      );
                    }}
                    value={parseDate(formik.values.offers[index].endDate)}
                    showMonthAndYearPickers
                  />
                </div>
              </div>
            ))}
            {formik.values.offers.length < 15 && (
              <div className="relative flex aspect-[5/2] w-full flex-col rounded-2xl border border-dashed border-default-500">
                <div className="ga-2 absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center">
                  <Button
                    variant="flat"
                    color="primary"
                    size="lg"
                    onClick={handleAddItem}
                    isIconOnly
                    radius="full"
                  >
                    <IconPlus size={24} />
                  </Button>
                  <Link className="whitespace-nowrap text-center">Add New</Link>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-end py-4">
            <Button
              type="submit"
              color="primary"
              endContent={<Icon icon="tabler:check" />}
              isLoading={formik.isSubmitting}
              onPress={() => {
                formik.handleSubmit();
              }}
            >
              Update
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
              <Progress
                value={
                  (stepCount * 100) /
                  formik.values.offers.filter((item) => item.preview).length
                }
                className="mb-4"
              />
              <p>
                {progressMessage} {stepCount}/
                {formik.values.offers.filter((item) => item.preview).length}
              </p>
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
                className="hidden"
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
