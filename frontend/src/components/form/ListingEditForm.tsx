import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Container, Grid, Typography, Button, FormControl, InputLabel, OutlinedInput, InputAdornment, Select, SelectChangeEvent, MenuItem, TextField, FormGroup, FormControlLabel, Checkbox, Tooltip, IconButton, ImageListItem, ImageListItemBar, ImageList, Stack } from '@mui/material';
import { fileToDataUrl, getErrorMessage } from 'utils/helper';
import { MdAdd, MdUpload, MdHighlightOff } from 'react-icons/md';
import { red } from '@mui/material/colors';
import { getListingDetails, updateListing } from 'utils/apiService';
import { useSnackbar } from 'notistack';
import { Address, Bedroom, ListingSubmission, Listing } from 'utils/dataType';
import NavBackButton from 'components/common/NavBackButton';

const ListingEditForm: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const [data, setData] = useState<Partial<Listing>>({})
  const [title, setTitle] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [price, setPrice] = useState('');
  const [bathroomNum, setBathroomNum] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState<Bedroom[]>([{ bedNum: 0, bedType: '' }]);
  const [amenities, setAmenities] = useState<string[]>([])
  const [thumbnail, setThumbnail] = useState('');
  const [images, setImages] = useState<string[]>([])

  const handleLoadData = async () => {
    try {
      if (!listingId) return;
      const originalData = await getListingDetails(Number(listingId))
      setData(originalData)
      setTitle(originalData.title || '');
      setStreet(originalData.address?.street || '');
      setCity(originalData.address?.city || '');
      setCountry(originalData.address?.country || '');
      setPrice(String(originalData.price) || '');
      setBathroomNum(String(originalData.metadata?.bathroomNum) || '')
      setPropertyType(originalData.metadata?.propertyType || '')
      setBedrooms(originalData.metadata?.bedrooms || [{ bedNum: 0, bedType: '' }])
      setAmenities(originalData.metadata?.amenities || [])
      setThumbnail(originalData.thumbnail || '')
      setImages(originalData.metadata?.images || [])
    } catch (error) {
      console.error(getErrorMessage(error))
    }
  }

  useEffect(() => {
    handleLoadData()
  }, [listingId])

  if (!data) {
    return <div>Loading...</div>;
  }

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handlePropertyTypeChange = (event: SelectChangeEvent) => {
    setPropertyType(event.target.value as string);
  };

  const handleAddBedroom = () => {
    setBedrooms([...bedrooms, { bedNum: 0, bedType: '' }]);
  };

  const handleDeleteBedroom = (index: number) => {
    setBedrooms(bedrooms.filter((_, i) => i !== index));
  };

  const handleBedroomChange = (index: number, key: string, value: unknown) => {
    const updatedBedrooms = bedrooms.map((bedroom, i) =>
      i === index ? { ...bedroom, [key]: value } : bedroom
    );
    setBedrooms(updatedBedrooms);
  };

  const handleAmenityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = amenities.indexOf(event.target.value)
    if (index === -1) {
      setAmenities([...amenities, event.target.value])
    } else {
      setAmenities(amenities.filter((amenity) => amenity !== event.target.value))
    }
  }

  const handleThumbnailChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      try {
        const dataUrl = await fileToDataUrl(event.target.files[0]);
        setThumbnail(dataUrl);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteThumbnail = () => {
    setThumbnail('');
  };

  const handleDeleteImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      try {
        const newImage = await fileToDataUrl(event.target.files[0]);
        const imageUrlList = [...images, newImage]
        setImages(imageUrlList);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      enqueueSnackbar('Please enter a title for the listing.', { variant: 'error' })
      return
    }
    if (!street.trim() || !city.trim() || !country.trim()) {
      enqueueSnackbar('Please complete the address information.', { variant: 'error' })
      return
    }
    if (!price.trim() || Number(price) <= 0) {
      enqueueSnackbar('Please enter a valid price.', { variant: 'error' })
      return
    }
    if (!bathroomNum.trim() || Number(bathroomNum) <= 0) {
      enqueueSnackbar('Please enter the number of bathrooms.', { variant: 'error' })
      return
    }
    if (!propertyType.trim()) {
      enqueueSnackbar('Please select a property type.', { variant: 'error' })
      return
    }
    if (bedrooms.some(bedroom => bedroom.bedNum <= 0 || !bedroom.bedType.trim())) {
      enqueueSnackbar('Please complete the bedroom details.', { variant: 'error' })
      return
    }
    if (!thumbnail.trim()) {
      enqueueSnackbar('Please upload a thumbnail image.', { variant: 'error' })
      return
    }

    const totalBedNum = bedrooms.reduce((acc, curr) => acc + Number(curr.bedNum), 0);

    const address: Address = { street, city, country };
    const metadata = { bathroomNum: Number(bathroomNum), propertyType, totalBedNum, bedrooms, amenities, images };

    const listingData: ListingSubmission = { title, address, price: Number(price), thumbnail, metadata };

    try {
      await updateListing(Number(listingId), listingData);
      navigate('/hosting');
      enqueueSnackbar('Successfully Updated the Listing.', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  };

  return (
    <Container component='main' maxWidth='md'>
      <NavBackButton route={'/hosting'} />
      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column' }} >
        <Typography variant="h6" sx={{ mb: 2 }}>Listing Title</Typography>
        {/* Listing Title */}
        <TextField
          required
          label="Title"
          name='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          sx={{ mb: 4 }}
        />

        <Typography variant="h6" sx={{ mb: 2 }}>Listing Address</Typography>
        <Grid container spacing={{ xs: 2, sm: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {/* Street */}
          <Grid item xs={4} sm={8} md={4}>
            <TextField
              required
              label="Street"
              name='Street'
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              fullWidth
            />
          </Grid>

          {/* City */}
          <Grid item xs={4} sm={4} md={4}>
            <TextField
              required
              label="City"
              name='City'
              value={city}
              onChange={(e) => setCity(e.target.value)}
              fullWidth
            />
          </Grid>

          {/* Country */}
          <Grid item xs={4} sm={4} md={4}>
            <TextField
              required
              label="Country"
              name='Country'
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Property Details</Typography>
        <Grid container spacing={{ xs: 2, sm: 2, md: 2 }} columns={{ xs: 4, sm: 12, md: 12 }}>
          {/* Listing Price */}
          <Grid item xs={4}>
            <FormControl fullWidth required>
              <InputLabel htmlFor="price-input">Price (per night)</InputLabel>
              <OutlinedInput
                id="price-input"
                type="number"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Price (per night)"
                name='Price'
                value={price}
                onChange={(e) => Number(e.target.value) < 0 ? setPrice('0') : setPrice(e.target.value)}
              />
            </FormControl>
          </Grid>

          {/* Number of Bathrooms */}
          <Grid item xs={4}>
            <TextField
              required
              label="Number of Bathrooms"
              name='Bathrooms'
              type="number"
              value={bathroomNum}
              onChange={(e) => setBathroomNum(e.target.value)}
              fullWidth
            />
          </Grid>

          {/* Property Type Dropdown */}
          <Grid item xs={4}>
            <FormControl fullWidth required>
              <InputLabel id='property-type-select-label' htmlFor='property-type-select'>Property Type</InputLabel>
              <Select
                labelId='property-type-select-label'
                name='property-type-select'
                value={propertyType}
                label="Property Type"
                onChange={handlePropertyTypeChange}
                inputProps={{ id: 'property-type-select' }}
              >
                <MenuItem id='property-type-house' value="House">House</MenuItem>
                <MenuItem id='property-type-apartment' value="Apartment">Apartment</MenuItem>
                <MenuItem id='property-type-hotel' value="Hotel">Hotel</MenuItem>
                <MenuItem id='property-type-other' value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Bedroom Information */}
        <Typography variant="h6" sx={{ mt: 4 }}>Bedroom Details</Typography>
        <Button onClick={handleAddBedroom} variant="outlined" fullWidth sx={{ maxWidth: 400, my: 1 }} startIcon={<MdAdd />}>Add Bedroom</Button>
        {bedrooms.map((bedroom, index) => (
          <Box key={index}>
            <Typography variant="subtitle1">Bedroom #{index + 1}</Typography>
            <Grid container spacing={{ xs: 1, sm: 2, md: 2 }} columns={{ xs: 12, sm: 12, md: 12 }}>
              <Grid item xs={5} sm={5} md={5}>
                <TextField
                  required
                  label="Number of Beds"
                  name='NumberOfBeds'
                  type="number"
                  value={bedroom.bedNum}
                  onChange={(e) => Number(e.target.value) < 0 ? handleBedroomChange(index, 'bedNum', 0) : handleBedroomChange(index, 'bedNum', e.target.value)}
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id={`bed-type-label-${index}`} htmlFor={`bed-type-select-${index}`}>Type of Bed</InputLabel>
                  <Select
                    labelId={`bed-type-label-${index}`}
                    name={`bed-type-select-${index}`}
                    value={bedroom.bedType}
                    label="Type of Bed"
                    onChange={(e) => handleBedroomChange(index, 'bedType', e.target.value)}
                    inputProps={{ id: `bed-type-select-${index}` }}
                  >
                    <MenuItem id="bed-type-king" value="King">King</MenuItem>
                    <MenuItem id="bed-type-queen" value="Queen">Queen</MenuItem>
                    <MenuItem id="bed-type-double" value="Double">Double</MenuItem>
                    <MenuItem id="bed-type-single" value="Single">Single</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={1} sm={1} md={1} sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title='Remove'>
                  <IconButton onClick={() => handleDeleteBedroom(index)}>
                    <MdHighlightOff color={red[500]} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        ))}

        {/* Amenities Checkboxes */}
        <Typography variant="h6" sx={{ mt: 4 }}>Amenities</Typography>
        <FormControl component="fieldset">
          <FormGroup>
            <Grid container spacing={{ xs: 1 }} columns={{ xs: 8, sm: 12, md: 12 }}>
              <Grid item xs={4}>
                <FormControlLabel
                  label='Wi-Fi'
                  control={<Checkbox id='amenity-wifi' value='Wi-Fi' checked={amenities.includes('Wi-Fi')} onChange={handleAmenityChange} />}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  label='TV'
                  control={<Checkbox id='amenity-tv' value='TV' checked={amenities.includes('TV')} onChange={handleAmenityChange} />}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  label='Kitchen'
                  control={<Checkbox id='amenity-kitchen' value='Kitchen' checked={amenities.includes('Kitchen')} onChange={handleAmenityChange} />}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  label='Wash machine'
                  control={<Checkbox id='amenity-washmachine' value='Wash machine' checked={amenities.includes('Wash machine')} onChange={handleAmenityChange} />}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  label='Heating'
                  control={<Checkbox id='amenity-heating' value='Heating' checked={amenities.includes('Heating')} onChange={handleAmenityChange} />}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  label='Air Conditioning'
                  control={<Checkbox id='amenity-airconditioning' value='Air Conditioning' checked={amenities.includes('Air Conditioning')} onChange={handleAmenityChange} />}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </FormControl>

        {/* Upload Thumbnail Field */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Thumbnail</Typography>
        <Box sx={{ maxWidth: 400 }}>
          <input
            id='thumbnail-input'
            accept="image/*"
            type="file"
            onChange={handleThumbnailChange}
            style={{ display: 'none' }}
            required
          />
          <label id='thumbnail-label' htmlFor='thumbnail-input'>
            <Button variant='outlined' component='span' fullWidth startIcon={<MdUpload />}>Upload Thumbnail</Button>
          </label>
          {thumbnail && (
            <ImageListItem sx={{ mt: 2 }}>
              <Box component='img' src={thumbnail} alt='Thumbnail' sx={{ width: '100%' }}></Box>
              <ImageListItemBar
                position='top'
                actionPosition='right'
                actionIcon={
                  <IconButton onClick={handleDeleteThumbnail}>
                    <MdHighlightOff color='#fff' />
                  </IconButton>
                }
                sx={{ width: '100%' }}
              >
              </ImageListItemBar>
            </ImageListItem>
          )}
        </Box>

        {/* Upload Images Field */}
        <Typography variant='h6' sx={{ mt: 4, mb: 2 }}>Property Images</Typography>
        <Box sx={{ maxWidth: 400 }}>
          <input
            id='images-input'
            accept='image/*'
            type='file'
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <label id='images-label' htmlFor='images-input'>
            <Button variant='outlined' component='span' fullWidth startIcon={<MdUpload />}>Upload Image</Button>
          </label>
          {images && (
            <ImageList id='image-list' sx={{ width: 380 }} cols={2} rowHeight={190}>
              {images.map((image, index) => (
                <ImageListItem key={index}>
                  <img id={`image-${index}`} src={image} alt='property image' />
                  <ImageListItemBar
                    position='top'
                    actionPosition='right'
                    actionIcon={
                      <IconButton onClick={() => handleDeleteImage(index)}>
                        <MdHighlightOff color='#fff' />
                      </IconButton>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </Box>

        {/* Form Submit Button */}
        <Stack spacing={2} sx={{ mt: 8, mb: 6 }} direction="row">
          <Button variant='contained' fullWidth size='large' sx={{ my: 4 }} color='inherit' onClick={() => navigate('/hosting')} name='close'>Cancel</Button>
          <Button variant='contained' fullWidth size='large' sx={{ my: 4 }} onClick={handleSubmit} name='submit'>Save</Button>
        </Stack>
      </Box>
    </Container>
  )
}

export default ListingEditForm
