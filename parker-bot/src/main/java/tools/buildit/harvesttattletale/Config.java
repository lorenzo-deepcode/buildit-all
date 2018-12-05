/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package tools.buildit.harvesttattletale;

import com.google.inject.Singleton;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.request.HttpRequest;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashMap;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;
import name.falgout.jeffrey.throwing.stream.ThrowingStream;
import org.apache.http.annotation.ThreadSafe;
import org.json.JSONObject;

/**
 *
 * @author benhernandez
 */
@Singleton
@ThreadSafe
public class Config {
    private String harvestUsername;
    private String harvestPassword;
    private double targetHours;
    private HashMap<String, String> emailSlackNames;
    private String organization;
    private String slackToken;
    private String overMessage;
    private String underMessage;
    private String zeroMessage;
    private int timeBetweenSlackMessages;
    
    public Config() {
        Unirest.setConcurrency(3, 3);
    }
    
    public synchronized HttpRequest getSlackUnirestGet(String endpoint) {
        return Unirest.get(String.format("%s%s/", "https://slack.com/api/", endpoint))
                .queryString("token", this.slackToken);
    }
    
    public synchronized HttpRequest getSlackUnirestGet(String endpoint, HashMap<String, Object> params) {
        return Unirest.get(String.format("%s%s/", "https://slack.com/api/", endpoint))
                .queryString("token", this.slackToken)
                .queryString(params);
    }
    
    public synchronized HttpRequest getHarvestUnirestGet(String endpoint) {
        return Unirest
                .get(String.format("http://%s.harvestapp.com/%s", this.organization, endpoint))
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .basicAuth(this.harvestUsername, this.harvestPassword);
    }
    
    public synchronized double getTargetHours() {
        return this.targetHours;
    }
    
    public synchronized HashMap<String, String> getEmailSlackNames() {
        return this.emailSlackNames;
    }
    
    public synchronized String getOverMessage() {
		return this.overMessage;
	}
    
    public synchronized String getUnderMessage() {
    	return this.underMessage;
    }
    
    public synchronized String getZeroMessage() {
    	return this.zeroMessage;
    }
    
    public synchronized int getTimeBetweenSlackMessages() {
    	return this.timeBetweenSlackMessages;
    }

	public synchronized void loadConfig(String filename) throws Exception {
        String contents = new String(Files.readAllBytes(Paths.get(filename)));
        JSONObject config = new JSONObject(contents);
        Stream<Field> fields = Arrays.asList(this.getClass().getDeclaredFields()).stream();
        ThrowingStream<Field, Exception> throwingFields =
                ThrowingStream.of(fields, Exception.class);
        throwingFields.forEach(tf -> {
            Class<?> classType = tf.getType();
            if (classType == String.class) {
                this.assignString(config, tf);
            } else if (classType == double.class) {
                this.assignDouble(config, tf);
            } else if (classType == HashMap.class) {
                this.assignHashMap(config, tf);
            }
        });
    }
    
    public synchronized void loadConfig() throws Exception {
        this.loadConfig("config.json");
    }
    
    private void assignString(JSONObject jo, Field f) throws Exception {
        f.set(this, jo.getString(f.getName()));
    }
    
    private void assignDouble(JSONObject jo, Field f) throws Exception {
        f.set(this, jo.getDouble(f.getName()));
    }
    
    private void assignHashMap (JSONObject jo, Field f) throws Exception {
        HashMap<String, Object> hm = new HashMap<String, Object>();
        JSONObject object = jo.getJSONObject(f.getName());
        StreamSupport.stream(object.keySet().spliterator(), false)
                .forEach(key -> {
                    hm.put(key, object.get(key));
                });
        f.set(this, hm);
    }    
}
