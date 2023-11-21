import dayjs from 'dayjs'
import config from 'config.json'
const FRONTEND_PORT = config.FRONTEND_PORT

describe('happy path', () => {
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

  it('1. Registers successfully', () => {
    cy.get('input[name="name"]').focus().type('A')
    cy.get('input[name="email"]').focus().type('A@email.com')
    cy.get('input[name="password"]').focus().type('passw0rd')
    cy.get('input[name="confirmPassword"]').focus().type('passw0rd')
    cy.get('button[name="submit"]').click()

    cy.url().should('include', `localhost:${FRONTEND_PORT}/hosting`)
    cy.get('#navbar-button').should('be.visible')
  })

  it('2. Creates a new listing successfully', () => {
    cy.get('button[name="CreateListingLinkBtn"]').should('be.visible').click()
    cy.url().should('include', `localhost:${FRONTEND_PORT}/listing/create`)
    cy.get('input[name="Title"]').focus().type('User Home')
    cy.get('input[name="Street"]').focus().type('120 King Street')
    cy.get('input[name="City"]').focus().type('Sydney')
    cy.get('input[name="Country"]').focus().type('AU')
    cy.get('input[name="Price"]').focus().type('200')
    cy.get('input[name="Bathrooms"]').focus().type('2')
    cy.get('#property-type-select').parent().click().get('ul > li[data-value="House"').click()
    cy.get('input[name="NumberOfBeds"]').focus().type('3')
    cy.get('#bed-type-select-0').parent().click().get('ul > li[data-value="King"').click()
    cy.get('#amenity-wifi').check().should('be.checked');
    cy.get('#amenity-tv').check().should('be.checked');
    cy.get('#amenity-kitchen').check().should('be.checked');
    cy.get('#thumbnail-label').selectFile('src/assets/sample-house.jpeg')
    cy.wait(2000)
    cy.get('button[name="submit"]').click()
    cy.wait(2000)
    cy.url().should('include', `localhost:${FRONTEND_PORT}/hosting`)
    cy.contains('User Home')
  })

  it('3. Updates the thumbnail and title of the listing successfully', () => {
    cy.get('button[name="EditListingLinkBtn"]').should('be.visible').click()
    // cy.get('button[name="EditListingLinkBtn"]').click()
    cy.url().should('include', `localhost:${FRONTEND_PORT}/listing/edit`)
    cy.get('input[name="Title"]').focus().clear().type('Updated Home Title')
    cy.get('#thumbnail-label').selectFile('src/assets/sample-house-2.jpeg')
    cy.wait(2000)
    cy.get('button[name="submit"]').click()
    cy.wait(2000)
    cy.url().should('include', `localhost:${FRONTEND_PORT}/hosting`)
    cy.contains('Updated Home Title')
  })

  it('4. Publish a listing successfully', () => {
    cy.get('button[name="OpenPublishDialogBtn"]').should('be.visible').click()
    const currentDate = dayjs().format('MM/DD/YYYY')
    const tomorrowDate = dayjs().add(1, 'day').format('MM/DD/YYYY')
    cy.findByLabelText('Start').click().type(`${currentDate}{enter}`)
    cy.findByLabelText('End').click().type(`${tomorrowDate}{enter}`)
    cy.get('button[name="submit"]').click()
    cy.wait(1000)
    cy.get('button[name="UnPublishListingBtn"]').should('be.visible')
  })

  it('5. Unpublish a listing successfully', () => {
    cy.get('button[name="UnPublishListingBtn"]').should('be.visible').click()
    cy.wait(1000)
    cy.get('button[name="OpenPublishDialogBtn"]').should('be.visible')
  })

  it('7. Logs out of the application successfully', () => {
    cy.get('#navbar-button').should('be.visible').click()
    cy.get('[data-testid="LogoutMenuItem"]').should('be.visible').click()
    cy.wait(1000)
    cy.clearAllLocalStorage()
    cy.contains('Landing Page')
    cy.get('button[name="headerLoginBtn"]').should('be.visible')
  })

  it('8. Logs back into the application successfully', () => {
    cy.get('button[name="headerLoginBtn"]').click()
    cy.url().should('include', `localhost:${FRONTEND_PORT}/login`)

    cy.get('input[name="email"]').focus().type('A@email.com')
    cy.get('input[name="password"]').focus().type('passw0rd')
    cy.get('button[name="submit"]').click()

    cy.url().should('include', `localhost:${FRONTEND_PORT}/hosting`)
    cy.get('#navbar-button').should('be.visible')
  })

  it('Successfully Publish a listing for User B to Booking', () => {
    cy.get('button[name="OpenPublishDialogBtn"]').should('be.visible').click()
    const currentDate = dayjs().format('MM/DD/YYYY')
    const afterOneMonth = dayjs().add(30, 'day').format('MM/DD/YYYY')
    cy.findByLabelText('Start').click().type(`${currentDate}{enter}`)
    cy.findByLabelText('End').click().type(`${afterOneMonth}{enter}`)
    cy.get('button[name="submit"]').click()
    cy.wait(1000)
    cy.get('button[name="UnPublishListingBtn"]').should('be.visible')
  })

  it('Successfully Logs out', () => {
    cy.get('#navbar-button').should('be.visible').click()
    cy.get('[data-testid="LogoutMenuItem"]').should('be.visible').click()
    cy.wait(1000)
    cy.clearAllLocalStorage()
    cy.contains('Landing Page')
    cy.get('button[name="headerLoginBtn"]').should('be.visible')
  })

  it('Registers User B successfully', () => {
    cy.get('button[name="headerLoginBtn"]').click()
    cy.url().should('include', `localhost:${FRONTEND_PORT}/login`)
    cy.get('[data-testid="registerLink"]').click()
    cy.url().should('include', `localhost:${FRONTEND_PORT}/register`)
    cy.get('input[name="name"]').focus().type('B')
    cy.get('input[name="email"]').focus().type('B@email.com')
    cy.get('input[name="password"]').focus().type('passw0rd')
    cy.get('input[name="confirmPassword"]').focus().type('passw0rd')
    cy.get('button[name="submit"]').click()

    cy.url().should('include', `localhost:${FRONTEND_PORT}/hosting`)
    cy.get('#navbar-button').should('be.visible')
  })

  it('6. Make a booking successfully', () => {
    cy.get('#AirbnbLogo').should('be.visible').click()
    cy.contains('Landing Page')
    cy.contains('Updated Home Title').click()
    cy.url().should('include', `localhost:${FRONTEND_PORT}/listing`)
    cy.contains('Listing Details')
    const currentDate = dayjs().format('MM/DD/YYYY')
    const tomorrowDate = dayjs().add(1, 'day').format('MM/DD/YYYY')
    cy.findByLabelText('Check In').click().type(`${currentDate}{enter}`)
    cy.findByLabelText('Check Out').click().type(`${tomorrowDate}{enter}`)
    cy.get('button[name="BookBtn"]').click()
    cy.wait(1000)
    cy.contains('pending')
    cy.get('#AirbnbLogo').should('be.visible').click()
    cy.contains('Booked')
  })
})
