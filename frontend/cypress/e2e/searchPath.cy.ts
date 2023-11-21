import dayjs from 'dayjs'
import config from 'config.json'
const FRONTEND_PORT = config.FRONTEND_PORT

describe('search path', () => {
  it('Should navigate to home page successfully', () => {
    cy.clearAllLocalStorage()
    cy.visit(`localhost:${FRONTEND_PORT}/`)
    cy.url().should('include', `localhost:${FRONTEND_PORT}`)
  })

  it('Should navigate to login screen successfully', () => {
    cy.clearAllLocalStorage()
    cy.get('button[name="headerLoginBtn"]').click()
    cy.url().should('include', `localhost:${FRONTEND_PORT}/login`)
  })

  it('Should navigate to register screen successfully', () => {
    cy.get('[data-testid="registerLink"]').click()
    cy.url().should('include', `localhost:${FRONTEND_PORT}/register`)
  })

  it('User C Registers successfully', () => {
    cy.get('input[name="name"]').focus().type('C')
    cy.get('input[name="email"]').focus().type('C@email.com')
    cy.get('input[name="password"]').focus().type('passw0rd')
    cy.get('input[name="confirmPassword"]').focus().type('passw0rd')
    cy.get('button[name="submit"]').click()

    cy.url().should('include', `localhost:${FRONTEND_PORT}/hosting`)
    cy.get('#navbar-button').should('be.visible')
  })

  it('#1 listing create and publish successfully', () => {
    cy.get('button[name="CreateListingLinkBtn"]').should('be.visible').click()
    cy.url().should('include', `localhost:${FRONTEND_PORT}/listing/create`)
    cy.get('input[name="Title"]').focus().type('C Apartment #1')
    cy.get('input[name="Street"]').focus().type('180 George Street')
    cy.get('input[name="City"]').focus().type('Sydney')
    cy.get('input[name="Country"]').focus().type('AU')
    cy.get('input[name="Price"]').focus().type('200')
    cy.get('input[name="Bathrooms"]').focus().type('2')
    cy.get('#property-type-select').parent().click().get('ul > li[data-value="Hotel"').click()
    cy.get('input[name="NumberOfBeds"]').focus().type('3')
    cy.get('#bed-type-select-0').parent().click().get('ul > li[data-value="Queen"').click()
    cy.get('#amenity-wifi').check().should('be.checked');
    cy.get('#amenity-tv').check().should('be.checked');
    cy.get('#amenity-kitchen').check().should('be.checked');
    cy.get('#thumbnail-label').selectFile('src/assets/sample-house-3.jpeg')
    cy.wait(2000)
    cy.get('button[name="submit"]').click()
    cy.wait(2000)
    cy.url().should('include', `localhost:${FRONTEND_PORT}/hosting`)
    cy.contains('C Apartment #1')

    cy.get('button[name="OpenPublishDialogBtn"]').should('be.visible').click()
    const start = dayjs().add(3, 'day').format('MM/DD/YYYY')
    const end = dayjs().add(7, 'day').format('MM/DD/YYYY')
    cy.findByLabelText('Start').click().type(`${start}{enter}`)
    cy.findByLabelText('End').click().type(`${end}{enter}`)
    cy.get('button[name="submit"]').click()
    cy.wait(1000)
    cy.get('button[name="UnPublishListingBtn"]').should('be.visible')
  })

  it('#2 listing create and publish successfull', () => {
    cy.get('button[name="CreateListingLinkBtn"]').should('be.visible').click()
    cy.url().should('include', `localhost:${FRONTEND_PORT}/listing/create`)
    cy.get('input[name="Title"]').focus().type('C Apartment #2')
    cy.get('input[name="Street"]').focus().type('111 Cool Street')
    cy.get('input[name="City"]').focus().type('Melbourne')
    cy.get('input[name="Country"]').focus().type('AU')
    cy.get('input[name="Price"]').focus().type('400')
    cy.get('input[name="Bathrooms"]').focus().type('3')
    cy.get('#property-type-select').parent().click().get('ul > li[data-value="Apartment"').click()
    cy.get('input[name="NumberOfBeds"]').focus().type('3')
    cy.get('#bed-type-select-0').parent().click().get('ul > li[data-value="King"').click()
    cy.get('#amenity-wifi').check().should('be.checked');
    cy.get('#amenity-heating').check().should('be.checked');
    cy.get('#amenity-washmachine').check().should('be.checked');
    cy.get('#thumbnail-label').selectFile('src/assets/sample-house-4.jpeg')
    cy.wait(2000)
    cy.get('button[name="submit"]').click()
    cy.wait(2000)
    cy.url().should('include', `localhost:${FRONTEND_PORT}/hosting`)
    cy.contains('C Apartment #2')

    cy.get('button[name="OpenPublishDialogBtn"]').should('be.visible').click()
    const start = dayjs().add(8, 'day').format('MM/DD/YYYY')
    const end = dayjs().add(15, 'day').format('MM/DD/YYYY')
    cy.findByLabelText('Start').click().type(`${start}{enter}`)
    cy.findByLabelText('End').click().type(`${end}{enter}`)
    cy.get('button[name="submit"]').click()
    cy.wait(1000)
    cy.get('button[name="UnPublishListingBtn"]').should('be.visible')
  })

  it('#3 listing create and publish successfull', () => {
    cy.get('button[name="CreateListingLinkBtn"]').should('be.visible').click()
    cy.url().should('include', `localhost:${FRONTEND_PORT}/listing/create`)
    cy.get('input[name="Title"]').focus().type('C Apartment #3')
    cy.get('input[name="Street"]').focus().type('001 Ben Street')
    cy.get('input[name="City"]').focus().type('Queensland')
    cy.get('input[name="Country"]').focus().type('AU')
    cy.get('input[name="Price"]').focus().type('500')
    cy.get('input[name="Bathrooms"]').focus().type('4')
    cy.get('#property-type-select').parent().click().get('ul > li[data-value="House"').click()
    cy.get('input[name="NumberOfBeds"]').focus().type('4')
    cy.get('#bed-type-select-0').parent().click().get('ul > li[data-value="Queen"').click()
    cy.get('#amenity-wifi').check().should('be.checked');
    cy.get('#amenity-tv').check().should('be.checked');
    cy.get('#amenity-kitchen').check().should('be.checked');
    cy.get('#amenity-washmachine').check().should('be.checked');
    cy.get('#amenity-heating').check().should('be.checked');
    cy.get('#amenity-airconditioning').check().should('be.checked');
    cy.get('#thumbnail-label').selectFile('src/assets/sample-house-5.jpeg')
    cy.wait(2000)
    cy.get('button[name="submit"]').click()
    cy.wait(2000)
    cy.url().should('include', `localhost:${FRONTEND_PORT}/hosting`)
    cy.contains('C Apartment #3')

    cy.get('button[name="OpenPublishDialogBtn"]').should('be.visible').click()
    const start = dayjs().add(20, 'day').format('MM/DD/YYYY')
    const end = dayjs().add(25, 'day').format('MM/DD/YYYY')
    cy.findByLabelText('Start').click().type(`${start}{enter}`)
    cy.findByLabelText('End').click().type(`${end}{enter}`)
    cy.get('button[name="submit"]').click()
    cy.wait(1000)
    cy.get('button[name="UnPublishListingBtn"]').should('be.visible')
  })

  it('User C Logs out successfully', () => {
    cy.get('#navbar-button').should('be.visible').click()
    cy.get('[data-testid="LogoutMenuItem"]').should('be.visible').click()
    cy.wait(1000)
    cy.clearAllLocalStorage()
    cy.contains('Landing Page')
    cy.get('button[name="headerLoginBtn"]').should('be.visible')
  })

  it('User D Register successfully', () => {
    cy.get('button[name="headerLoginBtn"]').click()
    cy.url().should('include', `localhost:${FRONTEND_PORT}/login`)
    cy.get('[data-testid="registerLink"]').click()
    cy.url().should('include', `localhost:${FRONTEND_PORT}/register`)
    cy.get('input[name="name"]').focus().type('D')
    cy.get('input[name="email"]').focus().type('D@email.com')
    cy.get('input[name="password"]').focus().type('passw0rd')
    cy.get('input[name="confirmPassword"]').focus().type('passw0rd')
    cy.get('button[name="submit"]').click()

    cy.url().should('include', `localhost:${FRONTEND_PORT}/hosting`)
    cy.get('#navbar-button').should('be.visible')
  })

  it('Search by Keyword', () => {
    cy.get('#AirbnbLogo').should('be.visible').click()
    cy.contains('Landing Page')
    cy.get('#tab-keyword').should('be.visible').click()
    cy.get('input[name="keyword-input"]').focus().type('#1')
    cy.get('button#search-by-keyword').click();
    cy.wait(1000)
    cy.get('[data-testid="index-card"]').should('have.length.at.least', 1) // Only match 1 result
    cy.contains('C Apartment #1');
    cy.get('button#reset-keyword').click()
    cy.get('[data-testid="index-card"]').should('have.length.at.least', 3)

    cy.get('input[name="keyword-input"]').focus().type('Melbourne')
    cy.get('button#search-by-keyword').click()
    cy.wait(1000)
    cy.get('[data-testid="index-card"]').should('have.length.at.least', 1) // Only match 1 result
    cy.contains('C Apartment #2')
    cy.get('button#reset-keyword').click()
    cy.get('[data-testid="index-card"]').should('have.length.at.least', 3)
  })

  it('Search by Number of Bedrooms', () => {
    cy.get('#tab-bedroom').should('be.visible').click()
    cy.get('button#search-by-bedrooms').click();
    cy.wait(1000)
    cy.get('[data-testid="index-card"]').should('have.length.at.least', 3)
    cy.get('button#reset-bedrooms').click()
    cy.get('[data-testid="index-card"]').should('have.length.at.least', 3)
  })

  it('Search by Date Range', () => {
    cy.get('#tab-date').should('be.visible').click()
    const start = dayjs().add(22, 'day').format('MM/DD/YYYY')
    const end = dayjs().add(24, 'day').format('MM/DD/YYYY')
    cy.findByLabelText('Check In').click().type(`${start}{enter}`)
    cy.findByLabelText('Check Out').click().type(`${end}{enter}`)
    cy.get('button#search-by-dates').click();
    cy.wait(1000)
    cy.get('[data-testid="index-card"]').should('have.length.at.least', 1) // Only match 1 result
    cy.contains('C Apartment #3')
    cy.get('button#reset-dates').click()
    cy.get('[data-testid="index-card"]').should('have.length.at.least', 3)
  })

  it('Search by Prices', () => {
    cy.get('#tab-price').should('be.visible').click()
    cy.get('button#search-by-prices').click();
    cy.wait(1000)
    cy.get('[data-testid="index-card"]').should('have.length.at.least', 1) // Only match 1 result
    cy.contains('C Apartment #1')
    cy.get('button#reset-prices').click()
    cy.get('[data-testid="index-card"]').should('have.length.at.least', 3)
  })

  it('Make a booking successfully', () => {
    cy.get('#AirbnbLogo').should('be.visible').click()
    cy.contains('Landing Page')
    cy.contains('C Apartment #1').click()
    cy.url().should('include', `localhost:${FRONTEND_PORT}/listing`)
    cy.contains('Listing Details')
    const start = dayjs().add(4, 'day').format('MM/DD/YYYY')
    const end = dayjs().add(6, 'day').format('MM/DD/YYYY')
    cy.findByLabelText('Check In').click().type(`${start}{enter}`)
    cy.findByLabelText('Check Out').click().type(`${end}{enter}`)
    cy.get('button[name="BookBtn"]').click()
    cy.wait(1000)
    cy.contains('pending')
    cy.get('#AirbnbLogo').should('be.visible').click()
    cy.contains('Booked')
  })

  it('User D Log out successfully', () => {
    cy.get('#navbar-button').should('be.visible').click()
    cy.get('[data-testid="LogoutMenuItem"]').should('be.visible').click()
    cy.wait(1000)
    cy.clearAllLocalStorage()
    cy.contains('Landing Page')
    cy.get('button[name="headerLoginBtn"]').should('be.visible')
  })

  it('User C Logs back successfully', () => {
    cy.get('button[name="headerLoginBtn"]').click()
    cy.url().should('include', `localhost:${FRONTEND_PORT}/login`)

    cy.get('input[name="email"]').focus().type('C@email.com')
    cy.get('input[name="password"]').focus().type('passw0rd')
    cy.get('button[name="submit"]').click()

    cy.url().should('include', `localhost:${FRONTEND_PORT}/hosting`)
    cy.get('#navbar-button').should('be.visible')
  })

  it('User C Accept User D Booking successfully', () => {
    cy.get('button[name="BookingLinkBtn-C Apartment #1"]').click()
    cy.contains('Booking Manage')
    cy.get('button[name="BookingAcceptBtn"]').should('be.visible').click()
    cy.wait(1000)
  })

  it('User C Log out successfully', () => {
    cy.get('#navbar-button').should('be.visible').click()
    cy.get('[data-testid="LogoutMenuItem"]').should('be.visible').click()
    cy.wait(1000)
    cy.clearAllLocalStorage()
    cy.contains('Landing Page')
    cy.get('button[name="headerLoginBtn"]').should('be.visible')
  })

  it('User D Logs back successfully', () => {
    cy.get('button[name="headerLoginBtn"]').click()
    cy.url().should('include', `localhost:${FRONTEND_PORT}/login`)

    cy.get('input[name="email"]').focus().type('D@email.com')
    cy.get('input[name="password"]').focus().type('passw0rd')
    cy.get('button[name="submit"]').click()

    cy.url().should('include', `localhost:${FRONTEND_PORT}/hosting`)
    cy.get('#navbar-button').should('be.visible')
  })

  it('User D Booking Status update successfully', () => {
    cy.get('#AirbnbLogo').should('be.visible').click()
    cy.contains('Landing Page')
    cy.contains('C Apartment #1').click()
    cy.url().should('include', `localhost:${FRONTEND_PORT}/listing`)
    cy.contains('Listing Details')
    cy.contains('accepted')
  })

  it('User D Log out successfully', () => {
    cy.get('#navbar-button').should('be.visible').click()
    cy.get('[data-testid="LogoutMenuItem"]').should('be.visible').click()
    cy.wait(1000)
    cy.clearAllLocalStorage()
    cy.contains('Landing Page')
    cy.get('button[name="headerLoginBtn"]').should('be.visible')
  })
})
