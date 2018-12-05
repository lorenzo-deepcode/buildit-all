import * as request from 'superagent';

import {RootLog as logger} from '../../utils/RootLogger';

import {MSGraphBase} from '../MSGraphBase';
import {GroupService, MSGroup} from './GroupService';
import {GraphTokenProvider} from '../tokens/TokenProviders';
import {MSUser} from '../users/UserService';

export class MSGraphGroupService extends MSGraphBase implements GroupService {

  constructor(graphTokenProvider: GraphTokenProvider) {
    super(graphTokenProvider);
    logger.info('Constructing MSGraphGroupService');
  }

  getGroup(name: string): Promise<MSGroup> {
    const URL = `https://graph.microsoft.com/v1.0/groups/${name}`;
    logger.info('MSGraphGroupService::getGroups() - ', URL);
    return new Promise((resolve, reject) => {
      this.tokenOperations.withToken()
          .then(token => {
            request.get(URL)
                   .set('Authorization', `Bearer ${token}`)
                   .end((error, response) => {
                     if (error) {
                       logger.error(error);
                       return reject(new Error(error));
                     }

                     // logger.info('Response', response);
                     const group = response.body.value;
                     resolve(group);
                   });
          });
    });
  }

  getGroups(): Promise<MSGroup[]> {
    const URL = 'https://graph.microsoft.com/v1.0/groups';
    logger.info('MSGraphGroupService::getGroups() - ', URL);
    return new Promise((resolve, reject) => {
      this.tokenOperations.withToken()
          .then(token => {
            request.get(URL)
                   .set('Authorization', `Bearer ${token}`)
                   .end((error, response) => {
                     if (error) {
                       logger.error(error);
                       return reject(new Error(error));
                     }

                     // logger.info('Response', response);
                     const groups = response.body.value;
                     resolve(groups);
                   });
          });
    });

  }


  getGroupMembers(id: string): Promise<MSUser[]> {
    const URL = `https://graph.microsoft.com/v1.0/groups/${id}/members`;
    logger.info('MSGraphGroupService::getGroupMembers() - ', URL);
    return new Promise((resolve, reject) => {
      this.tokenOperations.withToken()
          .then(token => {
            request.get(URL)
                   .set('Authorization', `Bearer ${token}`)
                   .end((error, response) => {
                     if (error) {
                       logger.error(error);
                       return reject(new Error(error));
                     }

                     // logger.info('Response', response.body.value);
                     const groups = response.body.value;
                     resolve(groups);
                   });
          });
    });
  }


  addGroupMember(groupName: string, memberName: string): Promise<boolean> {
    /*
    TODO: this is not correct per MS documentation.
     */
    const URL = `https://graph.microsoft.com/v1.0/groups/${groupName}/members/${memberName}`;
    logger.info('MSGraphGroupService::getGroupMembers() - ', URL);

    return new Promise((resolve, reject) => {
      this.tokenOperations.withToken()
          .then(token => {
            request.post(URL)
                   .set('Authorization', `Bearer ${token}`)
                   .end((error, response) => {
                     if (error) {
                       logger.error(error);
                       return reject(new Error(error));
                     }

                     resolve(true);
                   });
          });
    });
  }

}
