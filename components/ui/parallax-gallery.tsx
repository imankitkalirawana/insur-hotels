'use client';
import { useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Modal,
  ModalBody,
  ModalContent,
  ScrollShadow,
  useDisclosure,
  Button
} from '@nextui-org/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-react';

export const ParallaxGallery = ({
  images,
  className
}: {
  images: string[];
  className?: string;
}) => {
  const gridRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ['start start', 'end start']
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const third = Math.ceil(images?.length / 3);

  const firstPart = images.slice(0, third);
  const secondPart = images.slice(third, 2 * third);
  const thirdPart = images.slice(2 * third);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState(0); // To control slide direction
  const imageModal = useDisclosure();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    imageModal.onOpen();
  };

  const handleNext = () => {
    setDirection(1); // Moving forward
    setSelectedIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      // Check if we reached the end
      if (newIndex >= images?.length - 1) {
        setCanScrollRight(false); // Disable "Next"
      }
      setCanScrollLeft(true); // Enable "Previous"
      return newIndex % images?.length;
    });
  };

  const handlePrevious = () => {
    setDirection(-1); // Moving backward
    setSelectedIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? images?.length - 1 : prevIndex - 1;
      // Check if we reached the start
      if (newIndex === 0) {
        setCanScrollLeft(false); // Disable "Previous"
      }
      setCanScrollRight(true); // Enable "Next"
      return newIndex;
    });
  };
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <>
      <ScrollShadow
        className={cn(
          'h-[40rem] w-full items-start overflow-y-auto',
          className
        )}
        ref={gridRef}
      >
        <div
          className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-10 px-10 py-10 md:grid-cols-2 lg:grid-cols-3"
          ref={gridRef}
        >
          <div className="grid gap-10">
            {firstPart.map((el, idx) => (
              <motion.div style={{ y: translateFirst }} key={'grid-1' + idx}>
                <Image
                  src={el}
                  className="!m-0 h-80 w-full gap-10 rounded-lg object-cover object-left-top !p-0"
                  height="400"
                  width="400"
                  alt="thumbnail"
                  onClick={() => handleSelect(idx)}
                />
              </motion.div>
            ))}
          </div>
          <div className="grid gap-10">
            {secondPart.map((el, idx) => (
              <motion.div style={{ y: translateSecond }} key={'grid-2' + idx}>
                <Image
                  src={el}
                  className="!m-0 h-80 w-full gap-10 rounded-lg object-cover object-left-top !p-0"
                  height="400"
                  width="400"
                  alt="thumbnail"
                  onClick={() => handleSelect(idx + third)}
                />
              </motion.div>
            ))}
          </div>
          <div className="grid gap-10">
            {thirdPart.map((el, idx) => (
              <motion.div style={{ y: translateThird }} key={'grid-3' + idx}>
                <Image
                  src={el}
                  className="!m-0 h-80 w-full gap-10 rounded-lg object-cover object-left-top !p-0"
                  height="400"
                  width="400"
                  alt="thumbnail"
                  onClick={() => handleSelect(idx + 2 * third)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollShadow>
      <Modal
        size="5xl"
        isOpen={imageModal.isOpen}
        onOpenChange={imageModal.onClose}
        hideCloseButton
      >
        <ModalContent className="rounded-[30px]">
          {(onClose) => (
            <>
              <ModalBody className="relative flex h-[80vh] select-none flex-col items-center pb-6 pt-12">
                <div className="relative h-full w-full">
                  <AnimatePresence custom={direction}>
                    <motion.div
                      key={selectedIndex}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                      }}
                      className="absolute left-0 top-0 h-full w-full"
                    >
                      <Image
                        src={images[selectedIndex]}
                        className="mx-auto h-full w-full rounded-3xl object-cover"
                        height="800"
                        width="1200"
                        alt="thumbnail"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="mr-10 flex w-full justify-center gap-2 sm:justify-end">
                  <Button
                    aria-label="Scroll Left"
                    className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
                    onClick={handlePrevious}
                    isDisabled={!canScrollLeft}
                    isIconOnly
                  >
                    <IconArrowNarrowLeft className="h-6 w-6 text-gray-500" />
                  </Button>
                  <Button
                    aria-label="Scroll Right"
                    className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
                    onClick={handleNext}
                    isDisabled={!canScrollRight}
                    isIconOnly
                  >
                    <IconArrowNarrowRight className="h-6 w-6 text-gray-500" />
                  </Button>
                </div>
              </ModalBody>
              {/* <Button
                className="absolute right-1 top-1"
                isIconOnly
                onClick={onClose}
                variant="light"
                radius="full"
              >
                <Icon icon="eva:close-fill" fontSize={20} />
              </Button> */}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
