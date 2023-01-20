import type { Password, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";
import { authenticate } from "ldap-authentication";
import { getOrCreateUser, updateUserProps } from "~/models/user.server";

export async function verifyLogin(email: User["email"], password: string) {
  // first login with ldap

  let options = {
    ldapOpts: {
      url: process.env.LDAP_HOST, //'ldap://ldap.forumsys.com',
      // tlsOptions: { rejectUnauthorized: false }
    },
    adminDn: process.env.LDAP_USERNAME,
    adminPassword: process.env.LDAP_PASSWORD,
    userPassword: password,
    userSearchBase: process.env.LDAP_BASE_DN,
    usernameAttribute: process.env.LDAP_EMAIL_FIELD,
    username: email,
    groupsSearchBase: process.env.LDAP_BASE_DN,
    groupClass: process.env.LDAP_GROUP_CLASS,
    // groupMemberAttribute: process.env.LDAP_GROUP_NAME,
    // starttls: process.env.LDAP_START_TLS,
  };

  let ldapUser = await authenticate(options);
  if (!ldapUser) {
    return null;
  }

  // create user
  // await getOrCreateUser(email);

  // update user info
  return await updateUserProps(
    email,
    ldapUser[process.env.LDAP_FIRSTNAME],
    ldapUser[process.env.LDAP_LASTNAME],
    ldapUser.groups?.map((g) => g.cn)
  );
}
