'use client';

import { Hotel } from '@/lib/interface';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Input } from '@nextui-org/react';
import { IconPencil } from '@tabler/icons-react';
import { useFormik } from 'formik';
import React from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { isImage } from '@/functions/utility';
import { PHOTOMAXSIZE, VIDEOMAXSIZE } from '@/lib/config';

interface Props {
  hotel: Hotel;
}

export default function Banner({ hotel }: Props) {
  const formik = useFormik({
    initialValues: {
      banner: {
        text: hotel.banner.text,
        src: hotel.banner.src,
        file: new File([''], '', { type: 'image/jpeg' }),
        preview: ''
      }
    },
    onSubmit: async (values) => {
      if (values.banner.preview) {
        let filename = `hotels/${hotel.slug}/banner.${values.banner.file?.name.split('.').pop()}`;
        const previousFilename = `${values.banner.src.split('amazonaws.com/')[1]}`;
        const formData = new FormData();
        formData.append('file', values.banner.file);
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
          values.banner.src = data.url;
        });
      }
      await fetch(`/api/hotels/id/${hotel._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      }).then(() => {
        toast.success('Hotel updated successfully');
      });
    }
  });

  return (
    <>
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Banner
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">
            Upload or enter a custom banner text for your hotel.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit;
          }}
          className="mt-6"
        >
          <div className="flex flex-col items-center justify-center gap-4 py-4">
            <div className="relative w-96 rounded-2xl bg-default">
              <input
                id="photo"
                name="photo"
                type="file"
                className="hidden"
                accept="image/*,video/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const selectedFile: File = e.target.files[0];
                    if (
                      isImage(selectedFile.name) &&
                      selectedFile.size > PHOTOMAXSIZE
                    ) {
                      toast.error(`Image size should be less than 1MB`);
                      return;
                    } else if (selectedFile.size > VIDEOMAXSIZE) {
                      toast.error(`Video size should be less than 10MB`);
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
              <Image
                className="aspect-video min-w-96 rounded-2xl object-cover object-center"
                src={
                  formik.values.banner.preview
                    ? formik.values.banner.preview
                    : formik.values.banner.src
                }
                alt="banner"
                width={384}
                height={192}
              />
              <label
                htmlFor="photo"
                className="absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-2xl opacity-0 transition-all hover:bg-black/30 hover:opacity-100"
              >
                <IconPencil size={56} className="text-white" />
              </label>
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
    </>
  );
}
