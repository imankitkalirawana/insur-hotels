'use client';

import { Room } from '@/lib/interface';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Chip, Divider, Input } from '@nextui-org/react';
import { useFormik } from 'formik';
import { toast } from 'sonner';

interface Props {
  room: Room;
}

export default function Features({ room }: Props) {
  const formik = useFormik({
    initialValues: {
      popularWithGuests: room.popularWithGuests,
      roomFeatures: room.roomFeatures,
      safetyFeatures: room.safetyFeatures,
      bathroomFeatures: room.bathroomFeatures,
      otherFeatures: room.otherFeatures
    },
    onSubmit: async (values) => {
      try {
        await fetch(`/api/rooms/${room._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });
        toast.success('Room features updated');
      } catch (error) {
        console.error(error);
        toast.error('Failed to update room features');
      }
    }
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <h3>Popular with Guests</h3>
          <div className="mt-2">
            <Input
              name="popularWithGuests"
              value={formik.values.popularWithGuests.join(',')}
              onChange={(e) => {
                formik.setFieldValue(
                  'popularWithGuests',
                  e.target.value.split(',').map((item) => item)
                );
              }}
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
          <Divider className="my-8" />
          <h3>Room Features</h3>
          <div className="mt-2">
            <Input
              name="roomFeatures"
              value={formik.values.roomFeatures.join(',')}
              onChange={(e) => {
                formik.setFieldValue(
                  'roomFeatures',
                  e.target.value.split(',').map((item) => item)
                );
              }}
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
          <Divider className="my-8" />
          <h3>Safety Features</h3>
          <div className="mt-2">
            <Input
              name="safetyFeatures"
              value={formik.values.safetyFeatures.join(',')}
              onChange={(e) => {
                formik.setFieldValue(
                  'safetyFeatures',
                  e.target.value.split(',').map((item) => item)
                );
              }}
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
          <Divider className="my-8" />
          <h3>Bathroom Features</h3>
          <div className="mt-2">
            <Input
              name="bathroomFeatures"
              value={formik.values.bathroomFeatures.join(',')}
              onChange={(e) => {
                formik.setFieldValue(
                  'bathroomFeatures',
                  e.target.value.split(',').map((item) => item)
                );
              }}
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
          <Divider className="my-8" />
          <h3>Other Features</h3>
          <div className="mt-2">
            <Input
              name="otherFeatures"
              value={formik.values.otherFeatures.join(',')}
              onChange={(e) => {
                formik.setFieldValue(
                  'otherFeatures',
                  e.target.value.split(',').map((item) => item)
                );
              }}
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
          <div className="flex items-center justify-end py-4">
            <Button
              type="submit"
              color="primary"
              endContent={<Icon icon="tabler:check" />}
              isLoading={formik.isSubmitting}
            >
              Update
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
