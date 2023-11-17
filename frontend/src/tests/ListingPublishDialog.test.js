import React from 'react';
import { shallow, mount } from 'enzyme';
import ListingPublishDialog from 'components/dialog/ListingPublishDialog';

describe('ListingPublishDialog Component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <ListingPublishDialog
        open={true}
        handleClose={null}
        availabilities={[{ start: '', end: '' }]}
        setAvailabilities={null}
        listingId={1}
        onPublishSuccess={null}
      />
    );
    expect(wrapper.exists()).toBe(true);
  });

  it('should contain a "Go Live" button', () => {
    const wrapper = mount(
      <ListingPublishDialog
        open={true}
        handleClose={null}
        availabilities={[{ start: '', end: '' }]}
        setAvailabilities={null}
        listingId={1}
        onPublishSuccess={null}
      />
    );
    // Use `find` to locate the "Go Live" button
    const goLiveButton = wrapper.find({ children: 'Go Live' });
    // Assert whether the button exists
    expect(goLiveButton.exists()).toBe(true);
  });

  it('should contain a "Start date" button', () => {
    const wrapper = mount(
      <ListingPublishDialog
        open={true}
        handleClose={null}
        availabilities={[{ start: '', end: '' }]}
        setAvailabilities={null}
        listingId={1}
        onPublishSuccess={null}
      />
    );
    // Use `find` to locate the "Start" date button
    const goLiveDate = wrapper.find({ children: 'Start' });
    // Assert whether the button exists
    expect(goLiveDate.exists()).toBe(true);
  });
});
