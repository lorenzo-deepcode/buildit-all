package tools.buildit.harvesttattletale;

import static org.junit.Assert.*;
import com.google.inject.AbstractModule;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.concurrent.ConcurrentHashMap;

import com.google.inject.Guice;
import com.google.inject.Injector;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.request.HttpRequest;

@SuppressWarnings("unchecked")
public class HarvestTest {
	private static Harvest harvest;
    private static String sunday;
    private static String monday;
    private static HashMap<String, String> usersIdToEmails;
	private static HashMap<String, String> userEmailsToNames;
	private static ConcurrentHashMap<String, String> flaggedUsers;
	private static SlackStub slackStub;

	@BeforeClass
	public static void setUp() throws Exception {
		// Get the dates right
		LocalDate now = LocalDate.now();
		DateTimeFormatter harvestDateFormatter = DateTimeFormatter.ofPattern("YYYYMMdd");
        LocalDate sundayTemp = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
        LocalDate mondayTemp = sundayTemp.with(TemporalAdjusters.previous(DayOfWeek.MONDAY));
        HarvestTest.sunday = harvestDateFormatter.format(sundayTemp);
        HarvestTest.monday = harvestDateFormatter.format(mondayTemp);
        
        // User ConfigStub in place of Config and SlackStub in place of Slack
     	Injector injector = Guice.createInjector(new AbstractModule() {
     		@Override
     		protected void configure() {
     			bind(Config.class).to(ConfigStub.class);
     			bind(Slack.class).to(SlackStub.class);
     		}
     	});
     	ConfigStub config = injector.getInstance(ConfigStub.class);
     	config.setOverMessage("Over: %d, url: %s");
     	config.setUnderMessage("Under: %d, url: %s");
     	config.setZeroMessage("Zero! url: %s");
     	config.setTargetHours(40);
     	config.setTimeBetweenSlackMessages(0);
     	
     	// Setup ConfigStub to return some harvest users
		HttpResponse<JsonNode> usersResponse = mock(HttpResponse.class);
     	String usersContents = new String(Files.readAllBytes(Paths.get("harvestUsersList.json")));
     	when(usersResponse.getBody()).thenReturn(new JsonNode(usersContents));
     	HttpRequest usersRequest = mock(HttpRequest.class);
     	when(usersRequest.asJson()).thenReturn(usersResponse);
     	config.setHttpResponseFromHarvestWithEndpoint(usersRequest);
        
     	// Setup ConfigStub to return some timesheets.
     	JsonNode timeSheets = new JsonNode(new String(Files.readAllBytes(Paths.get("harvestTimeEntries.json"))));
     	for(int i = 0; i <= 3; i++) {
     		String intAsString = String.valueOf(i);
     		HttpResponse<JsonNode> timesheetResponse = mock(HttpResponse.class);
     		when(timesheetResponse.getBody()).thenReturn(new JsonNode(timeSheets.getObject().getJSONArray(intAsString).toString()));
     		HttpRequest timesheetRequest = mock(HttpRequest.class);
     		when(timesheetRequest.asJson()).thenReturn(timesheetResponse);
     		config.setHttpResponseFromHarvestWithEndpoint(HarvestTest.formHarvestIndividualEndpoint(i), timesheetRequest);
     	}
     	
     	HarvestTest.slackStub = injector.getInstance(SlackStub.class);
     	
     	// Get harvest users from fake endpoint
        HarvestTest.harvest = injector.getInstance(Harvest.class);
		HarvestTest.harvest.getAndChideUsers();
     
     	
     	// Grab the hashMaps from the slack instance.
     	Field usersIdToEmailsField = harvest.getClass().getDeclaredField("usersIdToEmails");
     	usersIdToEmailsField.setAccessible(true);
     	HarvestTest.usersIdToEmails = (HashMap<String, String>) usersIdToEmailsField.get(harvest);
     	Field userEmailsToNamesField = harvest.getClass().getDeclaredField("userEmailsToNames");
     	userEmailsToNamesField.setAccessible(true);
     	HarvestTest.userEmailsToNames = (HashMap<String, String>) userEmailsToNamesField.get(harvest);
     	Field flaggedUsersField = harvest.getClass().getDeclaredField("flaggedUsers");
     	flaggedUsersField.setAccessible(true);
     	HarvestTest.flaggedUsers = (ConcurrentHashMap<String, String>) flaggedUsersField.get(harvest);	
	}
	
	@Test
	public final void filtersOutInactiveHarvestUsers() {
		assertEquals("Only four users", 4, HarvestTest.usersIdToEmails.size(), 0);
		assertNull("inactive user is not there", HarvestTest.usersIdToEmails.get("4"));
	}
	
	@Test
	public final void storesEmailAddresesWithId() {
		assertEquals("User zero exists", "zero@test.com", HarvestTest.usersIdToEmails.get(0));
	}
	
	@Test
	public final void storesNamesWithEmailAddressesSoUserDoesNotWorkhard() {
		assertEquals("User zero exists", "Agent Zero", HarvestTest.userEmailsToNames.get("zero@test.com"));
	}
	
	@Test
	public final void onlyNotifyPeopleWhoHaveWrongNumberOfHours() {
		assertEquals("Only three users without the correct time", 3, HarvestTest.flaggedUsers.size(), 0);
		assertNull("person with correct time is not in flaggedUsers", HarvestTest.flaggedUsers.get("one@test.com"));
	}
	
	@Test
	public final void itCallsSlackTheCorrectNumberOfTimes() {
		assertEquals("Slack is called 3 times", 3, HarvestTest.slackStub.notifyUserViaSlackParams.size());
	}
	
	@Test
	public final void sendsCorrectUnderHoursMessage() {
		assertEquals("Correct email address is used", "zero@test.com", HarvestTest.slackStub.notifyUserViaSlackParams.get(0).get(0));
		assertTrue("Sends under message", HarvestTest.slackStub.notifyUserViaSlackParams.get(0).get(1).contains("Under:"));
	}
	
	@Test
	public final void sendsCorrectOverHoursMessage() {
		assertEquals("Correct email address is used", "two@test.com", HarvestTest.slackStub.notifyUserViaSlackParams.get(1).get(0));
		assertTrue("Sends under message", HarvestTest.slackStub.notifyUserViaSlackParams.get(1).get(1).contains("Over:"));
	}
	
	@Test
	public final void sendsCorrectZeroHoursMessage() {
		assertEquals("Correct email address is used", "three@test.com", HarvestTest.slackStub.notifyUserViaSlackParams.get(2).get(0));
		assertTrue("Sends under message", HarvestTest.slackStub.notifyUserViaSlackParams.get(2).get(1).contains("Zero!"));
	}
	
	private static String formHarvestIndividualEndpoint(int userId) {
        return String.format("people/%d/entries?from=%s&to=%s", userId, HarvestTest.monday, HarvestTest.sunday);
    }
}
