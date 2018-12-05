package tools.buildit.harvesttattletale;

import java.io.BufferedWriter;
import java.util.ArrayList;
import com.google.inject.Singleton;
import tools.buildit.harvesttattletale.Slack;

@Singleton
public class SlackStub extends Slack {
	private int getSlackUsersCalls = 0;
	public ArrayList<ArrayList<String>> notifyUserViaSlackParams;
	
	public SlackStub() {
		this.notifyUserViaSlackParams = new ArrayList<>();
	}
	
	public synchronized void getSlackUsers() {
		this.getSlackUsersCalls++;
	}
	
	public synchronized int getSlackUsersCallCount() {
		return this.getSlackUsersCalls;
	}
	
	public void notifyUserViaSlack(String email, String message, BufferedWriter bw) {
		ArrayList<String> params = new ArrayList<>();
		params.add(email);
		params.add(message);
		this.notifyUserViaSlackParams.add(params);
	}
}
