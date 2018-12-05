package tools.buildit.harvesttattletale;
import java.util.HashMap;

import org.apache.http.annotation.ThreadSafe;

import java.util.ArrayList;
import com.google.inject.Singleton;
import com.mashape.unirest.request.HttpRequest;

import tools.buildit.harvesttattletale.Config;

@Singleton
@ThreadSafe
public class ConfigStub extends Config{
	private double targetHours;
	private HashMap<String, String> emailSlackNames;
	private HttpRequest slackWithEndpoint;
	public ArrayList<String> slackWithEndpointArgs;
	private HashMap<String, HttpRequest> slackWithEndpointRequestMap;
	private HttpRequest slackWithEndpointAndParams;
	public ArrayList<ArrayList<Object>> slackWithEndpointAndParamsArgs;
	private HashMap<String, HttpRequest> slackWithEndpointAndParamsRequestMap;
	private HttpRequest harvestWithEndpoint;
	public ArrayList<String> harvestWithEndPointParams;
	private HashMap<String, HttpRequest> harvestWithEndpointRequestMap;
	private String overMessage;
	private String underMessage;
	private String zeroMessage;
	private int timeBetweenSlackMessages;
	
	public ConfigStub() {
		this.slackWithEndpointArgs = new ArrayList<String>();
		this.slackWithEndpointAndParamsArgs = new ArrayList<ArrayList<Object>>();
		this.harvestWithEndPointParams = new ArrayList<String>();
		this.slackWithEndpointRequestMap = new HashMap<>();
		this.slackWithEndpointAndParamsRequestMap = new HashMap<>();
		this.harvestWithEndpointRequestMap = new HashMap<>();
	}
	
	public synchronized HttpRequest getSlackUnirestGet(String endpoint) {
		this.slackWithEndpointArgs.add(endpoint);
		if (this.slackWithEndpointRequestMap.containsKey(endpoint)) {
			return this.slackWithEndpointRequestMap.get(endpoint);
		}
		return this.slackWithEndpoint;
	}
	
	public synchronized void setHttpResponseFromSlackWithEndpoint(HttpRequest hr) {
		this.slackWithEndpoint = hr;
	}
	
	public synchronized void setHttpResponseFromSlackWithEndpoint(String endpoint, HttpRequest hr) {
		this.slackWithEndpointRequestMap.put(endpoint, hr);
	}
	
	public synchronized HttpRequest getSlackUnirestGet(String endpoint, HashMap<String, Object> params) {
		ArrayList<Object> list = new ArrayList<>();
		list.add(endpoint);
		list.add(params);
		this.slackWithEndpointAndParamsArgs.add(list);
		if (this.slackWithEndpointAndParamsRequestMap.containsKey(endpoint)) {
			return this.slackWithEndpointAndParamsRequestMap.get(endpoint);
		}
		return this.slackWithEndpointAndParams;
	}
	
	public synchronized void setHttpResponseFromSlackWithEndpointAndParams(HttpRequest hr) {
		this.slackWithEndpointAndParams = hr;
	}
	
	public synchronized void setHttpResponseFromSlackWithEndpointAndParams(String endpoint, HttpRequest hr) {
		this.slackWithEndpointAndParamsRequestMap.put(endpoint, hr);
	}
	
	public synchronized HttpRequest getHarvestUnirestGet(String endpoint) {
		this.harvestWithEndPointParams.add(endpoint);
		if (this.harvestWithEndpointRequestMap.containsKey(endpoint)) {
			return this.harvestWithEndpointRequestMap.get(endpoint);
		}
		return this.harvestWithEndpoint;
	}
	
	public synchronized void setHttpResponseFromHarvestWithEndpoint(HttpRequest hr) {
		this.harvestWithEndpoint = hr;
	}
	
	public synchronized void setHttpResponseFromHarvestWithEndpoint(String endpoint, HttpRequest hr) {
		this.harvestWithEndpointRequestMap.put(endpoint, hr);
	}

	public synchronized void setTargetHours(double hours) {
		this.targetHours = hours;
	}
	
	public synchronized double getTargetHours() {
		return this.targetHours;
	}
	
	public synchronized void setEmailSlackNames(HashMap<String, String> hm) {
		this.emailSlackNames = hm;
	}
	
	public synchronized HashMap<String, String> getEmailSlackNames() {
		return this.emailSlackNames;
	}
	
	public synchronized void setOverMessage(String message) {
		this.overMessage = message;
	}
	
	public synchronized String getOverMessage() {
		return this.overMessage;
	}
	
	public synchronized void setUnderMessage(String message) {
		this.underMessage = message;
	}
	
	public synchronized String getUnderMessage() {
		return this.underMessage;
	}
	
	public synchronized void setZeroMessage(String message) {
		this.zeroMessage = message;
	}
	
	public synchronized String getZeroMessage() {
		return this.zeroMessage;
	}
	
	public synchronized void setTimeBetweenSlackMessages(int time) {
		this.timeBetweenSlackMessages = time;
	}
	
	public synchronized int getTimeBetweenSlackMessages() {
    	return this.timeBetweenSlackMessages;
    }
	
	public synchronized void loadConfig(String filename) {
		
	}
}