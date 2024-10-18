import Iphone15Pro from '@/components/magicui/iphone-15-pro';
import { Website } from '@/lib/interface';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Button,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress
} from '@nextui-org/react';
import { IconUpload } from '@tabler/icons-react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import router from 'next/router';
import { Suspense } from 'react';
import { toast } from 'sonner';

interface Props {
  website: Website;
}

export default function InstagrammableMoments({ website }: Props) {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      instagrammableMoment: website.instagrammableMoment
    },
    onSubmit: async (values) => {
      try {
        if (values.instagrammableMoment.video.preview) {
          let filename = `website/instagram.${values.instagrammableMoment.video.file?.name.split('.').pop()}`;
          const formData = new FormData();
          formData.append('file', values.instagrammableMoment.video.file);
          formData.append('filename', filename);
          await fetch(`/api/s3-upload`, {
            method: 'POST',
            body: formData
          }).then(async (res) => {
            const data = await res.json();
            values.instagrammableMoment.video.src = data.url;
          });
        }
        await fetch(`/api/website`, {
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

  return (
    <>
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Instagramable Moments
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">Update</p>
        </div>
        <form onSubmit={formik.handleSubmit} className="mt-6">
          <div className="flex flex-col gap-4">
            <input
              id="video"
              name="video"
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const selectedFile: File = e.target.files[0];
                  formik.setFieldValue(
                    'instagrammableMoment.video.file',
                    selectedFile
                  );
                  formik.setFieldValue(
                    'instagrammableMoment.video.preview',
                    URL.createObjectURL(selectedFile)
                  );
                }
              }}
            />

            {/* {formik.values.instagrammableMoment.video.preview ? ( */}
            <label
              htmlFor="video"
              className="relative mx-auto h-[600px] w-[300px]"
            >
              <Iphone15Pro>
                <Suspense fallback={<p>Loading video...</p>}>
                  <video
                    src={
                      formik.values.instagrammableMoment.video.preview
                        ? formik.values.instagrammableMoment.video.src
                        : formik.values.instagrammableMoment.video.src
                    }
                    className="flex h-full object-cover"
                    muted
                    autoPlay
                    loop
                    controls={false}
                    playsInline
                    preload="auto"
                    height={600}
                    width={300}
                  ></video>
                </Suspense>
              </Iphone15Pro>
              <Button
                variant="flat"
                as={'label'}
                htmlFor="video"
                isIconOnly
                radius="full"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-white"
              >
                <IconUpload size={24} />
              </Button>
            </label>

            <Input
              label="Text"
              value={formik.values.instagrammableMoment.text}
              onChange={formik.handleChange}
              name="instagrammableMoment.text"
            />
            <Input
              label="Url"
              value={formik.values.instagrammableMoment.url}
              onChange={formik.handleChange}
              name="instagrammableMoment.url"
            />
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
              <Progress value={60} className="mb-4" />
              <p>
                {formik.values.instagrammableMoment.video.preview
                  ? 'Uploading video'
                  : 'Updating website'}
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
