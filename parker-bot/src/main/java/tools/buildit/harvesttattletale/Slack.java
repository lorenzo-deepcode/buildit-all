/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package tools.buildit.harvesttattletale;

import com.google.inject.Inject;
import com.google.inject.Singleton;

import java.io.BufferedWriter;
import java.nio.Buffer;
import java.util.HashMap;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;
import org.json.JSONObject;

/**
 *
 * @author benhernandez
 */
@Singleton
public class Slack {
    @Inject private Config config;
    private HashMap<String, String> slackUsersByEmail;
    private HashMap<String, String> slackUsersByUsername;
    private HashMap<String, String> slackDisplayNamesByEmail;
    
    public synchronized void getSlackUsers() throws Exception {
        System.out.println("Loading slack information");
        Stream<JSONObject> stream =
                StreamSupport.stream(config.getSlackUnirestGet("users.list")
                .asJson()
                .getBody()
                .getObject()
                .getJSONArray("members").spliterator(), false)
                .map(o -> (JSONObject) o);
        
        this.slackUsersByEmail = new HashMap<String, String>();
        this.slackDisplayNamesByEmail = new HashMap<>();
        this.slackUsersByUsername = new HashMap<String, String>();
        
        stream
                .filter(o -> o.getBoolean("deleted") != true)
                .filter(o -> o.getJSONObject("profile").has("email"))
                .filter(o -> o.getBoolean("is_bot") == false)
                .forEach(o -> {
                    this.slackUsersByEmail.put(o.getJSONObject("profile").getString("email").toLowerCase(), o.getString("id"));
                    this.slackUsersByUsername.put(o.getString("name"), o.getString("id"));
                    this.slackDisplayNamesByEmail.put(o.getJSONObject("profile").getString("email").toLowerCase(), o.getString("name"));
                });
    }
    
    public void notifyUserViaSlack(String email, String message, BufferedWriter bw) throws Exception {
        HashMap<String, String> emailMap = config.getEmailSlackNames();
        String slackId = null;
        if (this.slackUsersByEmail.containsKey(email)) {
            slackId = this.slackUsersByEmail.get(email);
        } else if (emailMap.containsKey(email)) {
            String slackName = emailMap.get(email);
            if (this.slackUsersByUsername.containsKey(slackName)) {
                slackId = this.slackUsersByUsername.get(slackName);
            } else {
                throw new Exception(String.format("The username %s does not appear to be a valid/active slack user", slackName));   
            }
        }
        if (slackId != null) {
            if (this.slackDisplayNamesByEmail.containsKey((email))) {
                bw.append("@" + this.slackDisplayNamesByEmail.get(email) + "\n");
            }
            HashMap<String, Object> imOpen = new HashMap<String, Object>();
            imOpen.put("user", slackId);
            String channel = this.config.getSlackUnirestGet("im.open", imOpen)
                    .asJson()
                    .getBody()
                    .getObject()
                    .getJSONObject("channel")
                    .getString("id");

            HashMap<String, Object> chatPostMessage = new HashMap<String, Object>();
            chatPostMessage.put("channel", channel);
            chatPostMessage.put("as_user", false);
            chatPostMessage.put("link_names", true);
            chatPostMessage.put("text", message);
            int status = this.config.getSlackUnirestGet("chat.postMessage", chatPostMessage)
                    .asJson()
                    .getStatus();
            if (status != 200) {
                throw new Exception("Something went wrong communicating with slack");
            }
        } else {
            throw new Exception(String.format("I don't know who %s is", email));
        }
    }
}
