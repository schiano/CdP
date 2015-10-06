describe('Workshop test suit', function() {

  beforeEach(function() {
  	browser.driver.get('about:blank');
  	browser.get('http://37.187.102.237:8080/index.html');
    //browser.waitForAngular();
  });

  it('should add "Toto" Workshop', function() {
	expect(browser.getTitle()).toEqual('Workshop');

	// Counting the number of workshop
	var nbWorkshopsAtTheEnd = 1 + Number(element(by.binding('remaining')).getText());

  	// The add thingy should not be here before clicking +
  	expect(element(by.id('header')).isDisplayed()).toBeFalsy();

  	// Clicking +
    element(by.css('button.btn.btn-success.btn-round.pos-btn-add')).click();
    expect(element(by.id('header')).isDisplayed()).toBeTruthy();

    // Filling the formular
    element(by.id('new_workshop_title')).sendKeys("Toto");
    element(by.id('new_workshop_theme')).sendKeys("La blague");
    element(by.id('new_workshop_type')).sendKeys("Marrant");
    element(by.id('new_workshop_remarks')).sendKeys("Inderdit aux rabats-joie");
    element(by.id('new_workshop_laboratory')).sendKeys("Le laboratoire du rire");
    element(by.id('new_workshop_duration')).sendKeys("3 jours");
    element(by.id('new_workshop_capacity')).sendKeys("200");
    element(by.id('new_workshop_summary')).sendKeys("Des blagues pendant 3 jours !");
    element(by.id('new_workshop_location')).sendKeys("Bordeaux, France");
    element(by.id('new_workshop_target_public')).sendKeys("Personnes ayant un sens de l'humour.");
    element(by.id('new_workshop_target_content')).sendKeys("Blagues éducatives.");
    element(by.css('option[value="Sur réservation"]')).click();

    // We send it
    element(by.buttonText('Envoyer')).click();

    // Refresh the page
    browser.driver.navigate().refresh();

    // We should have one more workshop
    expect(Number(element(by.binding('remaining')).getText())).toEqual(nbWorkshopsAtTheEnd);
  });

  it('should modify "Toto" Workshop', function(){

  	var allElements = element.all(by.css('li[ng-repeat="workshop in workshops | filter:statusFilter"]'));
  	var workshopToto;

	for (var elem in allElements) {
		if (elem.element(by.css('.black-txt')).getText() == 'Toto ( La blague )')
		{
			workshopToto = elem;
			break;
		}
	}

  	// Clicking the "Editer" button.
  	workshopToto.element(by.css('.top-right.pointer')).click();

  	// Expecting the form to be visible
  	expect(element(by.id('header')).isDisplayed()).toBeTruthy();
  	// Expecting to have the fields filled
  	expect(element(by.id('new_workshop_title'))).toMatch("Toto");
    expect(element(by.id('new_workshop_theme'))).toMatch("La blague");
    expect(element(by.id('new_workshop_type'))).toMatch("Marrant");
    expect(element(by.id('new_workshop_remarks'))).toMatch("Inderdit aux rabats-joie");
    expect(element(by.id('new_workshop_laboratory'))).toMatch("Le laboratoire du rire");
    expect(element(by.id('new_workshop_duration'))).toMatch("3 jours");
    expect(element(by.id('new_workshop_capacity'))).toMatch("200");
    expect(element(by.id('new_workshop_summary'))).toMatch("Des blagues pendant 3 jours !");
    expect(element(by.id('new_workshop_location'))).toMatch("Bordeaux, France");
    expect(element(by.id('new_workshop_target_public'))).toMatch("Personnes ayant un sens de l'humour.");
    expect(element(by.id('new_workshop_target_content'))).toMatch("Blagues éducatives.");

    // Changing the title of workshop
    element(by.id('new_workshop_title')).clear().sendKeys("Le lab de Toto");
  });

  it('should remove "Le lab de Toto" Workshop', function(){
    // Counting the number of workshop
	var nbWorkshopsAtTheEnd = Number(element(by.binding('remaining')).getText()) - 1;

  	// Searching the workshop
  	var allElements = element.all(by.css('li[ng-repeat="workshop in workshops | filter:statusFilter"]'));
  	var workshopToto;

	for (var elem in allElements) {
		if (elem.element(by.css('.black-txt')).getText() == 'Toto ( La blague )')
		{
			workshopToto = elem;
			break;
		}
	}

	// clicking on the delete button
	workshopToto.element(by.css('.destroy')).click();

	// We should have one less workshop
    expect(Number(element(by.binding('remaining')).getText())).toEqual(nbWorkshopsAtTheEnd);

    // Refresh the page
    browser.driver.navigate().refresh();

    // We should still have one less workshop
    expect(Number(element(by.binding('remaining')).getText())).toEqual(nbWorkshopsAtTheEnd);
  });
});