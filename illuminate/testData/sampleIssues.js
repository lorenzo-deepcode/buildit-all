exports.getSampleData = function () {
  return sampleReply;
}

const sampleReply = {
  "expand": "schema,names",
  "startAt": 0,
  "maxResults": 5,
  "total": 355,
  "issues": [
    {
      "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
      "id": "16204",
      "self": "https://digitalrig.atlassian.net/rest/api/latest/issue/16204",
      "key": "CIT-1055",
      "changelog": {
        "startAt": 0,
        "maxResults": 4,
        "total": 4,
        "histories": [
          {
            "id": "32317",
            "author": {
              "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=amit.sarkar",
              "name": "amit.sarkar",
              "key": "amit.sarkar",
              "emailAddress": "amit.sarkar5@wipro.com",
              "avatarUrls": {
                "48x48": "https://digitalrig.atlassian.net/secure/useravatar?avatarId=11529",
                "24x24": "https://digitalrig.atlassian.net/secure/useravatar?size=small&avatarId=11529",
                "16x16": "https://digitalrig.atlassian.net/secure/useravatar?size=xsmall&avatarId=11529",
                "32x32": "https://digitalrig.atlassian.net/secure/useravatar?size=medium&avatarId=11529"
              },
              "displayName": "Amit Sarkar",
              "active": true,
              "timeZone": "Asia/Kolkata"
            },
            "created": "2016-03-22T02:59:01.278-0600",
            "items": [
              {
                "field": "assignee",
                "fieldtype": "jira",
                "from": "amit.sarkar",
                "fromString": "Amit Sarkar",
                "to": "darpan.36",
                "toString": "Darpan"
              }
            ]
          },
          {
            "id": "32327",
            "author": {
              "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=darpan.36",
              "name": "darpan.36",
              "key": "darpan.36",
              "emailAddress": "darpan.36@wipro.com",
              "avatarUrls": {
                "48x48": "https://secure.gravatar.com/avatar/885cc62992c29993fa7389fb7c00ea70?d=mm&s=48",
                "24x24": "https://secure.gravatar.com/avatar/885cc62992c29993fa7389fb7c00ea70?d=mm&s=24",
                "16x16": "https://secure.gravatar.com/avatar/885cc62992c29993fa7389fb7c00ea70?d=mm&s=16",
                "32x32": "https://secure.gravatar.com/avatar/885cc62992c29993fa7389fb7c00ea70?d=mm&s=32"
              },
              "displayName": "Darpan",
              "active": false,
              "timeZone": "America/Denver"
            },
            "created": "2016-03-22T04:40:55.652-0600",
            "items": [
              {
                "field": "status",
                "fieldtype": "jira",
                "from": "10000",
                "fromString": "Backlog",
                "to": "10700",
                "toString": "UX Review"
              }
            ]
          },
          {
            "id": "32372",
            "author": {
              "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=ashok.chockalingam",
              "name": "ashok.chockalingam",
              "key": "ashok.chockalingam",
              "emailAddress": "ashok.chockalingam@wipro.com",
              "avatarUrls": {
                "48x48": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=48",
                "24x24": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=24",
                "16x16": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=16",
                "32x32": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=32"
              },
              "displayName": "Ashok Bharathi Chockalingam",
              "active": false,
              "timeZone": "America/Denver"
            },
            "created": "2016-03-22T23:27:04.360-0600",
            "items": [
              {
                "field": "status",
                "fieldtype": "jira",
                "from": "10700",
                "fromString": "UX Review",
                "to": "10501",
                "toString": "In Progress"
              }
            ]
          },
          {
            "id": "32530",
            "author": {
              "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=darpan.36",
              "name": "darpan.36",
              "key": "darpan.36",
              "emailAddress": "darpan.36@wipro.com",
              "avatarUrls": {
                "48x48": "https://secure.gravatar.com/avatar/885cc62992c29993fa7389fb7c00ea70?d=mm&s=48",
                "24x24": "https://secure.gravatar.com/avatar/885cc62992c29993fa7389fb7c00ea70?d=mm&s=24",
                "16x16": "https://secure.gravatar.com/avatar/885cc62992c29993fa7389fb7c00ea70?d=mm&s=16",
                "32x32": "https://secure.gravatar.com/avatar/885cc62992c29993fa7389fb7c00ea70?d=mm&s=32"
              },
              "displayName": "Darpan",
              "active": false,
              "timeZone": "America/Denver"
            },
            "created": "2016-03-24T03:39:03.178-0600",
            "items": [
              {
                "field": "status",
                "fieldtype": "jira",
                "from": "10501",
                "fromString": "In Progress",
                "to": "10700",
                "toString": "UX Review"
              }
            ]
          }
        ]
      },
      "fields": {
        "summary": "Select Meeting Screen Changes..",
        "issuetype": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/issuetype/10001",
          "id": "10001",
          "description": "A user story. Created by JIRA Software - do not edit or delete.",
          "iconUrl": "https://digitalrig.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10315&avatarType=issuetype",
          "name": "Story",
          "subtask": false,
          "avatarId": 10315
        },
        "created": "2016-03-22T02:46:19.000-0600",
        "reporter": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=murugaraj.arjunamurthy",
          "name": "murugaraj.arjunamurthy",
          "key": "murugaraj.arjunamurthy",
          "emailAddress": "murugaraj.arjunamurthy@wipro.com",
          "avatarUrls": {
            "48x48": "https://secure.gravatar.com/avatar/253d32d0af4451e7c56a0914b0ca38eb?d=mm&s=48",
            "24x24": "https://secure.gravatar.com/avatar/253d32d0af4451e7c56a0914b0ca38eb?d=mm&s=24",
            "16x16": "https://secure.gravatar.com/avatar/253d32d0af4451e7c56a0914b0ca38eb?d=mm&s=16",
            "32x32": "https://secure.gravatar.com/avatar/253d32d0af4451e7c56a0914b0ca38eb?d=mm&s=32"
          },
          "displayName": "Murugaraj Arjunamurthy",
          "active": true,
          "timeZone": "America/Denver"
        },
        "priority": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/priority/3",
          "iconUrl": "https://digitalrig.atlassian.net/images/icons/priorities/medium.svg",
          "name": "Medium",
          "id": "3"
        },
        "updated": "2016-03-24T03:39:03.000-0600",
        "status": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/status/10700",
          "description": "",
          "iconUrl": "https://digitalrig.atlassian.net/images/icons/statuses/generic.png",
          "name": "UX Review",
          "id": "10700",
          "statusCategory": {
            "self": "https://digitalrig.atlassian.net/rest/api/2/statuscategory/4",
            "id": 4,
            "key": "indeterminate",
            "colorName": "yellow",
            "name": "In Progress"
          }
        }
      }
    },
    {
      "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
      "id": "16202",
      "self": "https://digitalrig.atlassian.net/rest/api/latest/issue/16202",
      "key": "CIT-1053",
      "changelog": {
        "startAt": 0,
        "maxResults": 3,
        "total": 3,
        "histories": [
          {
            "id": "32309",
            "author": {
              "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=amit.sarkar",
              "name": "amit.sarkar",
              "key": "amit.sarkar",
              "emailAddress": "amit.sarkar5@wipro.com",
              "avatarUrls": {
                "48x48": "https://digitalrig.atlassian.net/secure/useravatar?avatarId=11529",
                "24x24": "https://digitalrig.atlassian.net/secure/useravatar?size=small&avatarId=11529",
                "16x16": "https://digitalrig.atlassian.net/secure/useravatar?size=xsmall&avatarId=11529",
                "32x32": "https://digitalrig.atlassian.net/secure/useravatar?size=medium&avatarId=11529"
              },
              "displayName": "Amit Sarkar",
              "active": true,
              "timeZone": "Asia/Kolkata"
            },
            "created": "2016-03-21T06:53:17.894-0600",
            "items": [
              {
                "field": "assignee",
                "fieldtype": "jira",
                "from": "amit.sarkar",
                "fromString": "Amit Sarkar",
                "to": "anand.gupta9",
                "toString": "anand gupta"
              }
            ]
          },
          {
            "id": "32313",
            "author": {
              "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=anand.gupta",
              "name": "anand.gupta",
              "key": "anand.gupta9",
              "emailAddress": "anand.gupta9@wipro.com",
              "avatarUrls": {
                "48x48": "https://digitalrig.atlassian.net/secure/useravatar?avatarId=11525",
                "24x24": "https://digitalrig.atlassian.net/secure/useravatar?size=small&avatarId=11525",
                "16x16": "https://digitalrig.atlassian.net/secure/useravatar?size=xsmall&avatarId=11525",
                "32x32": "https://digitalrig.atlassian.net/secure/useravatar?size=medium&avatarId=11525"
              },
              "displayName": "anand gupta",
              "active": true,
              "timeZone": "Asia/Kolkata"
            },
            "created": "2016-03-22T02:05:21.848-0600",
            "items": [
              {
                "field": "status",
                "fieldtype": "jira",
                "from": "10000",
                "fromString": "Backlog",
                "to": "10001",
                "toString": "Selected for development"
              }
            ]
          },
          {
            "id": "32314",
            "author": {
              "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=anand.gupta",
              "name": "anand.gupta",
              "key": "anand.gupta9",
              "emailAddress": "anand.gupta9@wipro.com",
              "avatarUrls": {
                "48x48": "https://digitalrig.atlassian.net/secure/useravatar?avatarId=11525",
                "24x24": "https://digitalrig.atlassian.net/secure/useravatar?size=small&avatarId=11525",
                "16x16": "https://digitalrig.atlassian.net/secure/useravatar?size=xsmall&avatarId=11525",
                "32x32": "https://digitalrig.atlassian.net/secure/useravatar?size=medium&avatarId=11525"
              },
              "displayName": "anand gupta",
              "active": true,
              "timeZone": "Asia/Kolkata"
            },
            "created": "2016-03-22T02:05:24.637-0600",
            "items": [
              {
                "field": "status",
                "fieldtype": "jira",
                "from": "10001",
                "fromString": "Selected for development",
                "to": "10701",
                "toString": "Merge Candidate"
              }
            ]
          }
        ]
      },
      "fields": {
        "summary": "Consultation Summary Screen Changes",
        "issuetype": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/issuetype/10001",
          "id": "10001",
          "description": "A user story. Created by JIRA Software - do not edit or delete.",
          "iconUrl": "https://digitalrig.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10315&avatarType=issuetype",
          "name": "Story",
          "subtask": false,
          "avatarId": 10315
        },
        "created": "2016-03-21T05:18:51.000-0600",
        "reporter": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=murugaraj.arjunamurthy",
          "name": "murugaraj.arjunamurthy",
          "key": "murugaraj.arjunamurthy",
          "emailAddress": "murugaraj.arjunamurthy@wipro.com",
          "avatarUrls": {
            "48x48": "https://secure.gravatar.com/avatar/253d32d0af4451e7c56a0914b0ca38eb?d=mm&s=48",
            "24x24": "https://secure.gravatar.com/avatar/253d32d0af4451e7c56a0914b0ca38eb?d=mm&s=24",
            "16x16": "https://secure.gravatar.com/avatar/253d32d0af4451e7c56a0914b0ca38eb?d=mm&s=16",
            "32x32": "https://secure.gravatar.com/avatar/253d32d0af4451e7c56a0914b0ca38eb?d=mm&s=32"
          },
          "displayName": "Murugaraj Arjunamurthy",
          "active": true,
          "timeZone": "America/Denver"
        },
        "priority": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/priority/3",
          "iconUrl": "https://digitalrig.atlassian.net/images/icons/priorities/medium.svg",
          "name": "Medium",
          "id": "3"
        },
        "updated": "2016-03-22T02:05:24.000-0600",
        "status": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/status/10701",
          "description": "",
          "iconUrl": "https://digitalrig.atlassian.net/images/icons/statuses/generic.png",
          "name": "Merge Candidate",
          "id": "10701",
          "statusCategory": {
            "self": "https://digitalrig.atlassian.net/rest/api/2/statuscategory/4",
            "id": 4,
            "key": "indeterminate",
            "colorName": "yellow",
            "name": "In Progress"
          }
        }
      }
    },
    {
      "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
      "id": "16201",
      "self": "https://digitalrig.atlassian.net/rest/api/latest/issue/16201",
      "key": "CIT-1052",
      "changelog": {
        "startAt": 0,
        "maxResults": 3,
        "total": 3,
        "histories": [
          {
            "id": "32308",
            "author": {
              "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=amit.sarkar",
              "name": "amit.sarkar",
              "key": "amit.sarkar",
              "emailAddress": "amit.sarkar5@wipro.com",
              "avatarUrls": {
                "48x48": "https://digitalrig.atlassian.net/secure/useravatar?avatarId=11529",
                "24x24": "https://digitalrig.atlassian.net/secure/useravatar?size=small&avatarId=11529",
                "16x16": "https://digitalrig.atlassian.net/secure/useravatar?size=xsmall&avatarId=11529",
                "32x32": "https://digitalrig.atlassian.net/secure/useravatar?size=medium&avatarId=11529"
              },
              "displayName": "Amit Sarkar",
              "active": true,
              "timeZone": "Asia/Kolkata"
            },
            "created": "2016-03-21T06:52:52.576-0600",
            "items": [
              {
                "field": "assignee",
                "fieldtype": "jira",
                "from": "amit.sarkar",
                "fromString": "Amit Sarkar",
                "to": "anand.gupta9",
                "toString": "anand gupta"
              }
            ]
          },
          {
            "id": "32311",
            "author": {
              "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=anand.gupta",
              "name": "anand.gupta",
              "key": "anand.gupta9",
              "emailAddress": "anand.gupta9@wipro.com",
              "avatarUrls": {
                "48x48": "https://digitalrig.atlassian.net/secure/useravatar?avatarId=11525",
                "24x24": "https://digitalrig.atlassian.net/secure/useravatar?size=small&avatarId=11525",
                "16x16": "https://digitalrig.atlassian.net/secure/useravatar?size=xsmall&avatarId=11525",
                "32x32": "https://digitalrig.atlassian.net/secure/useravatar?size=medium&avatarId=11525"
              },
              "displayName": "anand gupta",
              "active": true,
              "timeZone": "Asia/Kolkata"
            },
            "created": "2016-03-22T02:05:03.234-0600",
            "items": [
              {
                "field": "status",
                "fieldtype": "jira",
                "from": "10000",
                "fromString": "Backlog",
                "to": "10001",
                "toString": "Selected for development"
              }
            ]
          },
          {
            "id": "32312",
            "author": {
              "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=anand.gupta",
              "name": "anand.gupta",
              "key": "anand.gupta9",
              "emailAddress": "anand.gupta9@wipro.com",
              "avatarUrls": {
                "48x48": "https://digitalrig.atlassian.net/secure/useravatar?avatarId=11525",
                "24x24": "https://digitalrig.atlassian.net/secure/useravatar?size=small&avatarId=11525",
                "16x16": "https://digitalrig.atlassian.net/secure/useravatar?size=xsmall&avatarId=11525",
                "32x32": "https://digitalrig.atlassian.net/secure/useravatar?size=medium&avatarId=11525"
              },
              "displayName": "anand gupta",
              "active": true,
              "timeZone": "Asia/Kolkata"
            },
            "created": "2016-03-22T02:05:10.692-0600",
            "items": [
              {
                "field": "status",
                "fieldtype": "jira",
                "from": "10001",
                "fromString": "Selected for development",
                "to": "10701",
                "toString": "Merge Candidate"
              }
            ]
          }
        ]
      },
      "fields": {
        "summary": "Deal Now- Changes in Product Search Screen",
        "issuetype": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/issuetype/10001",
          "id": "10001",
          "description": "A user story. Created by JIRA Software - do not edit or delete.",
          "iconUrl": "https://digitalrig.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10315&avatarType=issuetype",
          "name": "Story",
          "subtask": false,
          "avatarId": 10315
        },
        "created": "2016-03-21T05:16:19.000-0600",
        "reporter": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=murugaraj.arjunamurthy",
          "name": "murugaraj.arjunamurthy",
          "key": "murugaraj.arjunamurthy",
          "emailAddress": "murugaraj.arjunamurthy@wipro.com",
          "avatarUrls": {
            "48x48": "https://secure.gravatar.com/avatar/253d32d0af4451e7c56a0914b0ca38eb?d=mm&s=48",
            "24x24": "https://secure.gravatar.com/avatar/253d32d0af4451e7c56a0914b0ca38eb?d=mm&s=24",
            "16x16": "https://secure.gravatar.com/avatar/253d32d0af4451e7c56a0914b0ca38eb?d=mm&s=16",
            "32x32": "https://secure.gravatar.com/avatar/253d32d0af4451e7c56a0914b0ca38eb?d=mm&s=32"
          },
          "displayName": "Murugaraj Arjunamurthy",
          "active": true,
          "timeZone": "America/Denver"
        },
        "priority": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/priority/3",
          "iconUrl": "https://digitalrig.atlassian.net/images/icons/priorities/medium.svg",
          "name": "Medium",
          "id": "3"
        },
        "updated": "2016-03-22T02:05:10.000-0600",
        "status": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/status/10701",
          "description": "",
          "iconUrl": "https://digitalrig.atlassian.net/images/icons/statuses/generic.png",
          "name": "Merge Candidate",
          "id": "10701",
          "statusCategory": {
            "self": "https://digitalrig.atlassian.net/rest/api/2/statuscategory/4",
            "id": 4,
            "key": "indeterminate",
            "colorName": "yellow",
            "name": "In Progress"
          }
        }
      }
    },
    {
      "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
      "id": "16123",
      "self": "https://digitalrig.atlassian.net/rest/api/latest/issue/16123",
      "key": "CIT-1049",
      "changelog": {
        "startAt": 0,
        "maxResults": 3,
        "total": 3,
        "histories": [
          {
            "id": "32188",
            "author": {
              "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=ashok.chockalingam",
              "name": "ashok.chockalingam",
              "key": "ashok.chockalingam",
              "emailAddress": "ashok.chockalingam@wipro.com",
              "avatarUrls": {
                "48x48": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=48",
                "24x24": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=24",
                "16x16": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=16",
                "32x32": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=32"
              },
              "displayName": "Ashok Bharathi Chockalingam",
              "active": false,
              "timeZone": "America/Denver"
            },
            "created": "2016-03-17T21:24:28.547-0600",
            "items": [
              {
                "field": "assignee",
                "fieldtype": "jira",
                "from": null,
                "fromString": null,
                "to": "amit.sarkar",
                "toString": "Amit Sarkar"
              }
            ]
          },
          {
            "id": "32197",
            "author": {
              "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=amit.sarkar",
              "name": "amit.sarkar",
              "key": "amit.sarkar",
              "emailAddress": "amit.sarkar5@wipro.com",
              "avatarUrls": {
                "48x48": "https://digitalrig.atlassian.net/secure/useravatar?avatarId=11529",
                "24x24": "https://digitalrig.atlassian.net/secure/useravatar?size=small&avatarId=11529",
                "16x16": "https://digitalrig.atlassian.net/secure/useravatar?size=xsmall&avatarId=11529",
                "32x32": "https://digitalrig.atlassian.net/secure/useravatar?size=medium&avatarId=11529"
              },
              "displayName": "Amit Sarkar",
              "active": true,
              "timeZone": "Asia/Kolkata"
            },
            "created": "2016-03-17T23:37:55.066-0600",
            "items": [
              {
                "field": "assignee",
                "fieldtype": "jira",
                "from": "amit.sarkar",
                "fromString": "Amit Sarkar",
                "to": "anand.gupta9",
                "toString": "anand gupta"
              }
            ]
          },
          {
            "id": "32422",
            "author": {
              "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=anand.gupta",
              "name": "anand.gupta",
              "key": "anand.gupta9",
              "emailAddress": "anand.gupta9@wipro.com",
              "avatarUrls": {
                "48x48": "https://digitalrig.atlassian.net/secure/useravatar?avatarId=11525",
                "24x24": "https://digitalrig.atlassian.net/secure/useravatar?size=small&avatarId=11525",
                "16x16": "https://digitalrig.atlassian.net/secure/useravatar?size=xsmall&avatarId=11525",
                "32x32": "https://digitalrig.atlassian.net/secure/useravatar?size=medium&avatarId=11525"
              },
              "displayName": "anand gupta",
              "active": true,
              "timeZone": "Asia/Kolkata"
            },
            "created": "2016-03-23T00:35:20.722-0600",
            "items": [
              {
                "field": "status",
                "fieldtype": "jira",
                "from": "10000",
                "fromString": "Backlog",
                "to": "10701",
                "toString": "Merge Candidate"
              }
            ]
          }
        ]
      },
      "fields": {
        "summary": "Product Finder - Additional Fields for Bonds and Structure Notes",
        "issuetype": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/issuetype/10001",
          "id": "10001",
          "description": "A user story. Created by JIRA Software - do not edit or delete.",
          "iconUrl": "https://digitalrig.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10315&avatarType=issuetype",
          "name": "Story",
          "subtask": false,
          "avatarId": 10315
        },
        "created": "2016-03-17T21:24:17.000-0600",
        "reporter": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=ashok.chockalingam",
          "name": "ashok.chockalingam",
          "key": "ashok.chockalingam",
          "emailAddress": "ashok.chockalingam@wipro.com",
          "avatarUrls": {
            "48x48": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=48",
            "24x24": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=24",
            "16x16": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=16",
            "32x32": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=32"
          },
          "displayName": "Ashok Bharathi Chockalingam",
          "active": false,
          "timeZone": "America/Denver"
        },
        "priority": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/priority/3",
          "iconUrl": "https://digitalrig.atlassian.net/images/icons/priorities/medium.svg",
          "name": "Medium",
          "id": "3"
        },
        "updated": "2016-03-23T00:35:20.000-0600",
        "status": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/status/10701",
          "description": "",
          "iconUrl": "https://digitalrig.atlassian.net/images/icons/statuses/generic.png",
          "name": "Merge Candidate",
          "id": "10701",
          "statusCategory": {
            "self": "https://digitalrig.atlassian.net/rest/api/2/statuscategory/4",
            "id": 4,
            "key": "indeterminate",
            "colorName": "yellow",
            "name": "In Progress"
          }
        }
      }
    },
    {
      "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
      "id": "16118",
      "self": "https://digitalrig.atlassian.net/rest/api/latest/issue/16118",
      "key": "CIT-1044",
      "changelog": {
        "startAt": 0,
        "maxResults": 5,
        "total": 5,
        "histories": [
          {
            "id": "32105",
            "author": {
              "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=ashok.chockalingam",
              "name": "ashok.chockalingam",
              "key": "ashok.chockalingam",
              "emailAddress": "ashok.chockalingam@wipro.com",
              "avatarUrls": {
                "48x48": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=48",
                "24x24": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=24",
                "16x16": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=16",
                "32x32": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=32"
              },
              "displayName": "Ashok Bharathi Chockalingam",
              "active": false,
              "timeZone": "America/Denver"
            },
            "created": "2016-03-17T01:28:18.803-0600",
            "items": [
              {
                "field": "assignee",
                "fieldtype": "jira",
                "from": null,
                "fromString": null,
                "to": "amit.sarkar",
                "toString": "Amit Sarkar"
              }
            ]
          },
          {
            "id": "32106",
            "author": {
              "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=amit.sarkar",
              "name": "amit.sarkar",
              "key": "amit.sarkar",
              "emailAddress": "amit.sarkar5@wipro.com",
              "avatarUrls": {
                "48x48": "https://digitalrig.atlassian.net/secure/useravatar?avatarId=11529",
                "24x24": "https://digitalrig.atlassian.net/secure/useravatar?size=small&avatarId=11529",
                "16x16": "https://digitalrig.atlassian.net/secure/useravatar?size=xsmall&avatarId=11529",
                "32x32": "https://digitalrig.atlassian.net/secure/useravatar?size=medium&avatarId=11529"
              },
              "displayName": "Amit Sarkar",
              "active": true,
              "timeZone": "Asia/Kolkata"
            },
            "created": "2016-03-17T02:31:28.875-0600",
            "items": [
              {
                "field": "assignee",
                "fieldtype": "jira",
                "from": "amit.sarkar",
                "fromString": "Amit Sarkar",
                "to": "neelam.shah",
                "toString": "Neelam Shah"
              }
            ]
          },
          {
            "id": "32178",
            "author": {
              "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=neelam.shah",
              "name": "neelam.shah",
              "key": "neelam.shah",
              "emailAddress": "neelam.shah@wipro.com",
              "avatarUrls": {
                "48x48": "https://digitalrig.atlassian.net/secure/useravatar?avatarId=11520",
                "24x24": "https://digitalrig.atlassian.net/secure/useravatar?size=small&avatarId=11520",
                "16x16": "https://digitalrig.atlassian.net/secure/useravatar?size=xsmall&avatarId=11520",
                "32x32": "https://digitalrig.atlassian.net/secure/useravatar?size=medium&avatarId=11520"
              },
              "displayName": "Neelam Shah",
              "active": true,
              "timeZone": "America/Denver"
            },
            "created": "2016-03-17T07:56:49.485-0600",
            "items": [
              {
                "field": "status",
                "fieldtype": "jira",
                "from": "10000",
                "fromString": "Backlog",
                "to": "10700",
                "toString": "UX Review"
              }
            ]
          },
          {
            "id": "32179",
            "author": {
              "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=neelam.shah",
              "name": "neelam.shah",
              "key": "neelam.shah",
              "emailAddress": "neelam.shah@wipro.com",
              "avatarUrls": {
                "48x48": "https://digitalrig.atlassian.net/secure/useravatar?avatarId=11520",
                "24x24": "https://digitalrig.atlassian.net/secure/useravatar?size=small&avatarId=11520",
                "16x16": "https://digitalrig.atlassian.net/secure/useravatar?size=xsmall&avatarId=11520",
                "32x32": "https://digitalrig.atlassian.net/secure/useravatar?size=medium&avatarId=11520"
              },
              "displayName": "Neelam Shah",
              "active": true,
              "timeZone": "America/Denver"
            },
            "created": "2016-03-17T07:56:55.800-0600",
            "items": [
              {
                "field": "assignee",
                "fieldtype": "jira",
                "from": "neelam.shah",
                "fromString": "Neelam Shah",
                "to": "ashok.chockalingam",
                "toString": "Ashok Bharathi Chockalingam"
              }
            ]
          },
          {
            "id": "32365",
            "author": {
              "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=ashok.chockalingam",
              "name": "ashok.chockalingam",
              "key": "ashok.chockalingam",
              "emailAddress": "ashok.chockalingam@wipro.com",
              "avatarUrls": {
                "48x48": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=48",
                "24x24": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=24",
                "16x16": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=16",
                "32x32": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=32"
              },
              "displayName": "Ashok Bharathi Chockalingam",
              "active": false,
              "timeZone": "America/Denver"
            },
            "created": "2016-03-22T23:23:01.044-0600",
            "items": [
              {
                "field": "resolution",
                "fieldtype": "jira",
                "from": null,
                "fromString": null,
                "to": "10000",
                "toString": "Done"
              },
              {
                "field": "status",
                "fieldtype": "jira",
                "from": "10700",
                "fromString": "UX Review",
                "to": "10002",
                "toString": "Done"
              }
            ]
          }
        ]
      },
      "fields": {
        "summary": "Fulfilment module - No Sticky Footer, Disable Risk Level Link, Add Back Link ",
        "issuetype": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/issuetype/10001",
          "id": "10001",
          "description": "A user story. Created by JIRA Software - do not edit or delete.",
          "iconUrl": "https://digitalrig.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10315&avatarType=issuetype",
          "name": "Story",
          "subtask": false,
          "avatarId": 10315
        },
        "created": "2016-03-17T01:27:48.000-0600",
        "reporter": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=ashok.chockalingam",
          "name": "ashok.chockalingam",
          "key": "ashok.chockalingam",
          "emailAddress": "ashok.chockalingam@wipro.com",
          "avatarUrls": {
            "48x48": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=48",
            "24x24": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=24",
            "16x16": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=16",
            "32x32": "https://secure.gravatar.com/avatar/ca496c8ecf18d8aa471b3353c4db250b?d=mm&s=32"
          },
          "displayName": "Ashok Bharathi Chockalingam",
          "active": false,
          "timeZone": "America/Denver"
        },
        "priority": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/priority/1",
          "iconUrl": "https://digitalrig.atlassian.net/images/icons/priorities/highest.svg",
          "name": "Highest",
          "id": "1"
        },
        "updated": "2016-03-22T23:23:01.000-0600",
        "status": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/status/10002",
          "description": "Issues can only move to done after they've been tested",
          "iconUrl": "https://digitalrig.atlassian.net/images/icons/subtask.gif",
          "name": "Done",
          "id": "10002",
          "statusCategory": {
            "self": "https://digitalrig.atlassian.net/rest/api/2/statuscategory/3",
            "id": 3,
            "key": "done",
            "colorName": "green",
            "name": "Done"
          }
        }
      }
    }
  ]
}
