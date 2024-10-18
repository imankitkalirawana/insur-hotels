import { Website } from '@/lib/interface';
import {
  Input,
  Link,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress
} from '@nextui-org/react';
import { IconPencil } from '@tabler/icons-react';
import { useFormik } from 'formik';
import React from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react/dist/iconify.js';
import Image from 'next/image';

interface Props {
  website: Website;
}

export default function Facilities({ website }: Props) {
  const [stepCount, setStepCount] = React.useState(0);
  const [progressMessage, setProgressMessage] = React.useState('');
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      facilities: website.facilities
    },
    onSubmit: async (values) => {
      try {
        if (values.facilities.length > 0) {
          setProgressMessage('Uploading files...');
          for (let i = 0; i < values.facilities.length; i++) {
            if (values.facilities[i].preview) {
              const formData = new FormData();
              formData.append('file', values.facilities[i].file);
              formData.append(
                'filename',
                `website/facilities/facility-${i}.${values.facilities[i].file.name.split('.').pop()}`
              );
              await fetch(`/api/s3-upload`, {
                method: 'POST',
                body: formData
              }).then(async (res) => {
                const data = await res.json();
                values.facilities[i].src = data.url;
                setStepCount(i + 1);
              });
            }
          }
        }
        await fetch(`/api/website`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        }).then(() => {
          toast.success(
            'Hotel updated successfully, Please wait for few minutes to reflect changes'
          );
        });
      } catch (e) {
        console.error(e);
        toast.error('Something went wrong');
      }
    }
  });

  return (
    <>
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Features
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">
            Update your website features section.
          </p>
        </div>
        <form onSubmit={formik.handleSubmit} className="mt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {formik.values.facilities.map((item, index) => (
              <div key={index} className="realtive flex max-w-xs flex-col">
                <div className="relative h-36 w-full rounded-2xl bg-default">
                  <input
                    id={`facility-photo-${index}`}
                    name={`facility-photo-${index}`}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const selectedFile: File = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = () => {
                          const imageData = reader.result as string;
                          formik.setFieldValue(
                            `facilities[${index}].file`,
                            selectedFile
                          );
                          formik.setFieldValue(
                            `facilities[${index}].preview`,
                            imageData
                          );
                        };
                        reader.readAsDataURL(selectedFile);
                      }
                    }}
                  />
                  {formik.values.facilities[index].src ||
                  formik.values.facilities[index].preview ? (
                    <>
                      <Image
                        src={
                          formik.values.facilities[index].preview
                            ? formik.values.facilities[index].preview
                            : item.src
                        }
                        className="aspect-video rounded-2xl object-cover"
                        alt="facility"
                        width={300}
                        height={150}
                      />
                      <label
                        htmlFor={`facility-photo-${index}`}
                        className="absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-2xl opacity-0 transition-all hover:bg-black/30 hover:opacity-100"
                      >
                        <IconPencil size={36} className="text-white" />
                      </label>
                    </>
                  ) : (
                    <label
                      htmlFor={`facility-photo-${index}`}
                      className="inset-0 z-10 flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-default bg-white transition-all"
                    >
                      <Link as={'span'}>Select an image</Link>
                    </label>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <Input
                    label="Title"
                    value={formik.values.facilities[index].name}
                    name="name"
                    size="sm"
                    onChange={(e) => {
                      formik.setFieldValue(
                        `facilities[${index}].name`,
                        e.target.value
                      );
                    }}
                  />
                  <Input
                    label="Description"
                    value={formik.values.facilities[index].description}
                    name="description"
                    onChange={(e) => {
                      formik.setFieldValue(
                        `facilities[${index}].description`,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
            ))}
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
              <Progress value={stepCount * 25} className="mb-4" />
              <p>
                {progressMessage} {stepCount}/4
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
