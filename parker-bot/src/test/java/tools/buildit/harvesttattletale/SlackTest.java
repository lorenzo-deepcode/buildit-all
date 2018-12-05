package tools.buildit.harvesttattletale;

import static org.junit.Assert.*;
import com.google.inject.AbstractModule;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.mockito.Mockito.*;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import com.google.inject.Guice;
import com.google.inject.Injector;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.request.HttpRequest;

@SuppressWarnings("unchecked")
public class SlackTest{
	
	private static Slack slack;
	private static ConfigStub config;
	private static HashMap<String, String> slackUsersByEmail;
	private static HashMap<String, String> slackUsersByUsername;
	
	@BeforeClass
	public static void setUp() throws Exception {
		// User ConfigStub in place of Config
		Injector injector = Guice.createInjector(new AbstractModule() {
			@Override
			protected void configure() {
				bind(Config.class).to(ConfigStub.class);
			}
		});
		// Setup ConfigStub to return some slack users
		SlackTest.config = injector.getInstance(ConfigStub.class);
		HttpResponse<JsonNode> response = mock(HttpResponse.class);
		String contents = new String(Files.readAllBytes(Paths.get("slackStubResponse.json")));
		when(response.getBody()).thenReturn(new JsonNode(contents));
		HttpRequest hr = mock(HttpRequest.class);
		when(hr.asJson()).thenReturn(response);
		SlackTest.config.setHttpResponseFromSlackWithEndpoint(hr);
		
		// Mock getting the channel id from slack.
		HttpResponse<JsonNode> imOpenResponse = mock(HttpResponse.class);
		String imOpenRaw =
				  "{"
				+ "  \"channel\": {"
				+ "    \"id\": \"some channel id\""
				+ "   }"
				+ "}";
		when(imOpenResponse.getBody()).thenReturn(new JsonNode(imOpenRaw));
		HttpRequest imOpenRequest = mock(HttpRequest.class);
		when(imOpenRequest.asJson()).thenReturn(imOpenResponse);
		SlackTest.config.setHttpResponseFromSlackWithEndpointAndParams("im.open", imOpenRequest);
		
		// Mock sending message to slack user.
		HttpResponse<JsonNode> chatPostMessageResponse = mock(HttpResponse.class);
		when(chatPostMessageResponse.getStatus()).thenReturn(200);
		HttpRequest chatPostMessageRequest = mock(HttpRequest.class);
		when(chatPostMessageRequest.asJson()).thenReturn(chatPostMessageResponse);
		SlackTest.config.setHttpResponseFromSlackWithEndpointAndParams("chat.postMessage", chatPostMessageRequest);
		
		// Setup ConfigStub with fake email makes
		HashMap<String, String> emailMap = new HashMap<>();
		emailMap.put("v2@test.com", "valid2SlackName");
		SlackTest.config.setEmailSlackNames(emailMap);
		
		// Get slack users from fake endpoint
        SlackTest.slack = injector.getInstance(Slack.class);
		SlackTest.slack.getSlackUsers();
		
		// Grab the hashMaps from the slack instance.
		Field byEmailField = slack.getClass().getDeclaredField("slackUsersByEmail");
		byEmailField.setAccessible(true);
		SlackTest.slackUsersByEmail = (HashMap<String, String>) byEmailField.get(slack);
		Field byUsernameField = slack.getClass().getDeclaredField("slackUsersByUsername");
		byUsernameField.setAccessible(true);
		SlackTest.slackUsersByUsername = (HashMap<String, String>) byUsernameField.get(slack);

		BufferedWriter bw = new BufferedWriter(new FileWriter("at-names"));
		
		SlackTest.slack.notifyUserViaSlack("validname1@test.com", "Hello", bw);
		SlackTest.slack.notifyUserViaSlack("v2@test.com", "Hello", bw);
	}

	@Test
	public final void firstValidUserIsInEmailMap() throws Exception {
		assertEquals(
				"It gets the correct slack id for the first valid user",
				"valid1SlackId",
				SlackTest.slackUsersByEmail.get("validname1@test.com"));
	}
	
	@Test
	public final void secondValidUserIsInEmailMap() throws Exception {
		assertEquals(
				"It gets the correct slack id for the second valid user",
				"valid2SlackId",
				SlackTest.slackUsersByEmail.get("validname2@test.com"));
	}

	@Test
	public final void doesNotSaveDeletedSlackUsersInEmailMap() throws Exception {
		assertNull(
				"Deleted users are not saved in the email list",
				SlackTest.slackUsersByEmail.get("deleted@test.com"));
		
	}
	
	@Test
	public final void doesNotSaveRobotSlackUsersInEmailMap() throws Exception {
		assertNull(
				"Deleted users are not saved in the email list",
				SlackTest.slackUsersByEmail.get("robot@test.com"));
		
	}
	
	@Test
	public final void firstValidUserIsInUsernameMap() throws Exception {
		assertEquals(
				"It gets the correct username for the first valid user",
				"valid1SlackId",
				SlackTest.slackUsersByUsername.get("valid1SlackName"));
	}
	
	@Test
	public final void secondValidUserIsInUsernameMap() throws Exception {
		assertEquals(
				"It gets the correct username for the second valid user",
				"valid2SlackId",
				SlackTest.slackUsersByUsername.get("valid2SlackName"));
	}

	@Test
	public final void doesNotSaveDeletedSlackUsersInUsernameMap() throws Exception {
		assertNull(
				"Deleted users are not saved in the email list",
				SlackTest.slackUsersByUsername.get("bye felicia"));
		
	}
	
	@Test
	public final void doesNotSaveRobotSlackUsersInUsernameMap() throws Exception {
		assertNull(
				"Deleted users are not saved in the email list",
				SlackTest.slackUsersByUsername.get("Wall-e"));
		
	}
	
	@Test
	public final void opensUpDirectMessageWithFirstUser() {
		ArrayList<Object> call = SlackTest.config.slackWithEndpointAndParamsArgs.get(0);
		assertEquals("It opens a chat message", "im.open", call.get(0));
		HashMap<String, String> params1 = (HashMap<String, String>) call.get(1);
		assertEquals("It opens a chat message to the correct user", "valid1SlackId", params1.get("user"));
	}
	
	@Test
	public final void sendsCorrectTextAcrossDirectMessage() {
		ArrayList<Object> call = SlackTest.config.slackWithEndpointAndParamsArgs.get(1);
		assertEquals("It opens a chat message", "chat.postMessage", call.get(0));
		HashMap<String, Object> params2 = (HashMap<String, Object>) call.get(1);
		assertEquals("It opens a chat message to the correct channel", "some channel id", params2.get("channel"));
		assertEquals("It sends itself as a bot message", false, params2.get("as_user"));
		assertEquals("It adds hot linking in the messages", true, params2.get("link_names"));
		assertEquals("Sends the correct message", "Hello", params2.get("text"));
	}
	
	@Test
	public final void canSendToUsersViaConfigEmailMap() {
		ArrayList<Object> call = SlackTest.config.slackWithEndpointAndParamsArgs.get(2);
		HashMap<String, String> params3 = (HashMap<String, String>) call.get(1);
		assertEquals("It opens a chat message to the correct user", "valid2SlackId", params3.get("user"));
	}
}
