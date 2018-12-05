package tools.buildit.harvesttattletale;

import static org.junit.Assert.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Test;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.request.HttpRequest;
import com.mashape.unirest.http.options.Options;
import com.mashape.unirest.http.options.Option;

public class ConfigTest {

	@Test
	public final void testConfig() {
		Unirest.setConcurrency(1, 1);
		new Config();
		assertEquals("3 max concurrent connections", 3, Options.getOption(Option.MAX_TOTAL));
		assertEquals("3 max concurrent connections per route", 3, Options.getOption(Option.MAX_PER_ROUTE));
	}

	@Test
	public final void testGetSlackUnirestGetString() throws Exception {
		Config config = new Config();
		config.loadConfig("testConfig.json");
		HttpRequest hr = config.getSlackUnirestGet("endpoint");
		assertTrue("It adds the endpoint", hr.getUrl().contains("/endpoint"));
		assertTrue("It adds the slack token", hr.getUrl().endsWith("token=a-slack-token"));
	}

	@Test
	public final void testGetSlackUnirestGetStringHashMapOfStringObject() throws Exception{
		Config config = new Config();
		config.loadConfig("testConfig.json");
		HashMap<String, Object> params = new HashMap<>();
		params.put("some", "param");
		HttpRequest hr = config.getSlackUnirestGet("endpoint", params);
		assertTrue("It adds the endpoint", hr.getUrl().contains("/endpoint"));
		assertTrue("It adds the slack token", hr.getUrl().contains("token=a-slack-token"));
		assertTrue("It adds the custom params", hr.getUrl().contains("some=param"));
	}

	@Test
	public final void testGetHarvestUnirestGet() throws Exception {
		Config config = new Config();
		config.loadConfig("testConfig.json");
		HttpRequest hr = config.getHarvestUnirestGet("endpoint");
		assertTrue("It adds the endpoint", hr.getUrl().contains("/endpoint"));
		Map<String, List<String>> headers = hr.getHeaders();
		assertEquals("It sets the Content-Type header", "application/json", headers.get("Content-Type").get(0));
		assertEquals("It sets the accept header", "application/json", headers.get("accept").get(0));
		assertEquals("It sets the Authorization header", "Basic dGVzdEBhZG1pbi5jb206c29tZXBhc3N3b3Jk", headers.get("Authorization").get(0));
	}

	@Test
	public final void testGetTargetHours() throws Exception {
		Config config = new Config();
		config.loadConfig("testConfig.json");
		assertEquals("It gets the correct target hours", 50, config.getTargetHours(), 0);
	}

	@Test
	public final void testGetEmailSlackNames() throws Exception {
		Config config = new Config();
		config.loadConfig("testConfig.json");
		assertEquals("It loads the email map", "test.name", config.getEmailSlackNames().get("test@test.com"));
	}

	@Test
	public final void testGetOverMessage() throws Exception {
		Config config = new Config();
		config.loadConfig("testConfig.json");
		assertEquals("Provides the Over Message", "Test Over Message", config.getOverMessage());
	}

	@Test
	public final void testGetUnderMessage() throws Exception {
		Config config = new Config();
		config.loadConfig("testConfig.json");
		assertEquals("Provides the Under Message", "Test Under Message", config.getUnderMessage());
	}

	@Test
	public final void testGetZeroMessage() throws Exception {
		Config config = new Config();
		config.loadConfig("testConfig.json");
		assertEquals("Provides the Zero Message", "Test Zero Message", config.getZeroMessage());
	}

	@Test
	public final void testLoadConfigString() throws Exception {
		Config config = new Config();
		config.loadConfig("testConfig.json");
		assertEquals("It can load a special config", 50, config.getTargetHours(), 0);
	}

	@Test
	public final void testLoadConfig() throws Exception {
		Config config = new Config();
		config.loadConfig();
		assertNotNull("The config is loaded", config.getEmailSlackNames());
	}
	

}
