package server.test.e2e;

import static net.sourceforge.jwebunit.junit.JWebUnit.beginAt;
import static net.sourceforge.jwebunit.junit.JWebUnit.clickLink;
import static net.sourceforge.jwebunit.junit.JWebUnit.setBaseUrl;
import static net.sourceforge.jwebunit.junit.JWebUnit.setTextField;
import static net.sourceforge.jwebunit.junit.JWebUnit.submit;
import net.sourceforge.jwebunit.junit.JWebUnit;

import org.junit.Before;
import org.junit.Test;

import server.test.resources.TestServerInformation;

public class AddAtelierTestCase {

	@Before
    public void prepare() {
        setBaseUrl(TestServerInformation.BaseURL);
    }
	
	@Test
	public void test() {
		beginAt("home.xhtml"); //Open the browser on http://localhost:8080/workshop/home.xhtml
		JWebUnit.assertLinkPresent("login");
        clickLink("login");
        JWebUnit.assertTitleEquals("Login");
        setTextField("username", TestServerInformation.UserId);
        setTextField("password", TestServerInformation.UserPswd);
        submit();
        
        JWebUnit.assertLinkNotPresent("login");
        JWebUnit.assertLinkPresent("AddAtelier");
        clickLink("AddAtelier");
        
        /*
         * Assert de la présence des différents champs à remplir
         */
        
        /*// Remplir le formulaire d'ajout d'atelier
        setTextField(inputName, value);
        setTextField(inputName, value);
        setTextField(inputName, value);
        setTextField(inputName, value);
        setTextField(inputName, value);
        */
        
        // Submit le formulaire d'ajout
        submit();
	}

}
