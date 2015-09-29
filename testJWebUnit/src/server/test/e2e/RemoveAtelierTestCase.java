package server.test.e2e;

import static net.sourceforge.jwebunit.junit.JWebUnit.beginAt;
import static net.sourceforge.jwebunit.junit.JWebUnit.clickLink;
import static net.sourceforge.jwebunit.junit.JWebUnit.setBaseUrl;
import static net.sourceforge.jwebunit.junit.JWebUnit.setTextField;
import static net.sourceforge.jwebunit.junit.JWebUnit.submit;
import static org.junit.Assert.*;

import net.sourceforge.jwebunit.junit.JWebUnit;

import org.junit.Before;
import org.junit.Test;

import server.test.resources.TestServerInformation;

public class RemoveAtelierTestCase {

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
        JWebUnit.assertLinkPresent("Mes ateliers");
        clickLink("Mes ateliers");
        
        /*
         * Assert de la présence de l'atelier que l'on veut delete
         */
        
        /*
         * click sur le bouton delete
         */
        
        /*
         * Assert de l'absence de l'atelier dans la liste des ateliers
         */
	}

}
