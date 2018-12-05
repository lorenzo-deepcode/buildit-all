/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package tools.buildit.harvesttattletale;

import com.google.inject.Inject;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Stream;      
import java.util.stream.StreamSupport;
import org.json.JSONObject;          
                                     
/**                                  
 *
 * @author benhernandez
 */
public class Harvest {
    @Inject private Config config;
    @Inject private Slack slack;
    private HashMap<Integer, String> usersIdToEmails;
    private HashMap<String, String> userEmailsToNames;
    private ConcurrentHashMap<String, Double> flaggedUsers;
    private final LocalDate sunday;
    private final LocalDate monday;
    private final DateTimeFormatter harvestDateFormatter;
   
    public Harvest() {
        LocalDate now = LocalDate.now();
        sunday = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY)) ;
        monday = sunday.with(TemporalAdjusters.previous(DayOfWeek.MONDAY));
        harvestDateFormatter = DateTimeFormatter.ofPattern("YYYYMMdd");
        System.out.println(String.format("Analyzing from %s to %s", this.monday, this.sunday));
    }
    
    public void getAndChideUsers() throws Exception {
        this.getListFromHarvest();
        this.getFlaggedUsers();
        int timeBetweenSlackMessages = config.getTimeBetweenSlackMessages();
        System.out.println("Starting notifications, slack limits us to 1 per second, be patient");
        ArrayList<String> errors = new ArrayList<String>();
        BufferedWriter atNames = new BufferedWriter(new FileWriter("at-names"));
        BufferedWriter emails = new BufferedWriter(new FileWriter("emails"));
        atNames.write("");
        this.flaggedUsers.entrySet().stream()
                .forEach(entry -> {
                    LocalDateTime start = LocalDateTime.now();
                    System.out.println(String.format("Sending notification to %s", this.userEmailsToNames.get(entry.getKey())));
                    String url = String.format("https://builditglobal.harvestapp.com/time/week/%s", monday.format(DateTimeFormatter.ofPattern("YYYY/MM/dd")));
                    String message;
                    if (entry.getValue() == 0.0) {
                        message = String.format(config.getZeroMessage(), url);
                    } else if (entry.getValue() < 40.0) {
                        message = String.format(config.getUnderMessage(), entry.getValue().intValue(), url);
                    } else if (entry.getValue() > 40.0) {
                    	message = String.format(config.getOverMessage(), entry.getValue().intValue(), url);
                    } else {
                    	message = "Something went wrong with this bot, please let me know.";
                    }
                    message = String.format("%s If you believe you received this message in error, please contact <@U59MY6JL8|parker>. If unsure where to book time to, ask in <#C38GDS7QE|buildit_ops>", message);
                    try {
                        emails.append(entry.getKey() + "\n");
                        this.slack.notifyUserViaSlack(entry.getKey(), message, atNames);
                        LocalDateTime end = LocalDateTime.now();
                        long difference = timeBetweenSlackMessages - ChronoUnit.MILLIS.between(start, end);
                        if (difference > 0) {
                            Thread.sleep(difference);
                        }
                    } catch (Exception ex) {
                    	ex.printStackTrace();
                        errors.add(String.format("Error notifying %s (%s)", this.userEmailsToNames.get(entry.getKey()), entry.getKey()));
                    }
                });
        atNames.close();
        emails.close();
        Unirest.shutdown();
        errors.stream().forEach(System.out::println);
        if (errors.size() > 0) {
            System.out.println("Please add these people to the config.json file and notify by hand this week.");
        }
    }
    
    private void getListFromHarvest() throws Exception {
        System.out.println("Getting all users from Harvest");
        Stream<JSONObject> stream = StreamSupport.stream(config.getHarvestUnirestGet("people")
                .asJson()
                .getBody()
                .getArray().spliterator(), false)
                .map(o -> (JSONObject) o)
                .map(o -> o.getJSONObject("user"));
        
        this.usersIdToEmails = new HashMap<Integer, String>();
        this.userEmailsToNames = new HashMap<String, String>();
        stream
                .filter(o -> o.getBoolean("is_active") == true)
                .forEach(o -> {
                    this.usersIdToEmails.put(o.getInt("id"), o.getString("email").toLowerCase());
                    this.userEmailsToNames.put(o.getString("email").toLowerCase(), o.getString("first_name") + " " + o.getString("last_name"));
                });
    }
    
    private void getFlaggedUsers() {
        this.flaggedUsers = new ConcurrentHashMap<String, Double>();
        System.out.println("Grabbing users time entries, one at a time because harvest api sucks");
        double targetHours = config.getTargetHours();
        this.usersIdToEmails.entrySet().stream()
                .parallel()
                .forEach(entry -> {
                    System.out.println(String.format("Getting %s", entry.getValue()));
                    try {
                        String endpoint = this.formHarvestIndividualEndpoint(entry.getKey());
                        double hours = StreamSupport.stream(config.getHarvestUnirestGet(endpoint)
                            .asJson()
                            .getBody()
                            .getArray().spliterator(), false)
                            .map(o -> (JSONObject) o)
                            .map(o -> o.getJSONObject("day_entry"))
                            .reduce(0.0, (prev, current) -> prev + current.getDouble("hours"), (a, b) -> a);
                        if(hours != targetHours) {
                            this.flaggedUsers.put(entry.getValue(), hours);
                        }
                    } catch (UnirestException ex) {
                        Logger.getLogger(Harvest.class.getName()).log(Level.SEVERE, null, ex);
                    }
                });
        System.out.println(String.format("Found %d user(s) not at the target hours", this.flaggedUsers.size()));
    }
    
    private String formHarvestIndividualEndpoint(int userId) {
        return String.format("people/%d/entries?from=%s&to=%s", userId,
                this.harvestDateFormatter.format(this.monday),
                this.harvestDateFormatter.format(this.sunday));
    }
}
