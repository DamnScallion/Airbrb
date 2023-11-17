import React, { useState } from 'react';
import { Box, Button, MobileStepper } from '@mui/material';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { useTheme } from '@mui/material/styles';

interface ImageSwiperProps {
  images: string[];
}

const ImageSwiper: React.FC<ImageSwiperProps> = ({ images }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ maxWidth: 600, flexGrow: 1 }}>
      <Box
        component='img'
        sx={{
          height: 400,
          display: 'block',
          maxWidth: 600,
          overflow: 'hidden',
          width: '100%',
        }}
        src={images[activeStep]}
        alt='Listing Images'
      />
      <MobileStepper
        steps={maxSteps}
        position='static'
        activeStep={activeStep}
        nextButton={
          <Button
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            {theme.direction === 'rtl' ? <MdKeyboardArrowLeft size={24} /> : <MdKeyboardArrowRight size={24} />}
          </Button>
        }
        backButton={
          <Button onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? <MdKeyboardArrowRight size={24} /> : <MdKeyboardArrowLeft size={24} />}
          </Button>
        }
      />
    </Box>
  );
};

export default ImageSwiper;
