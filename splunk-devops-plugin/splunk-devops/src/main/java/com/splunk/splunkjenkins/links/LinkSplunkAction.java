package com.splunk.splunkjenkins.links;


import com.splunk.splunkjenkins.SplunkJenkinsInstallation;
import hudson.model.Action;

import com.splunk.splunkjenkins.Messages;

public class LinkSplunkAction implements Action {
    String query;
    String page;
    String displayName;

    public LinkSplunkAction(String tab, String query, String displayName) {
        this.query = query;
        this.page = tab;
        this.displayName = displayName;
    }

    @Override
    public String getIconFileName() {
        return Messages.SplunkIconName();
    }

    @Override
    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String getUrlName() {
        SplunkJenkinsInstallation instance = SplunkJenkinsInstallation.get();
        return instance.getAppUrlOrHelp() + page + "?" + query;
    }
}
