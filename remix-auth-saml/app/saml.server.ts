// saml server
import * as samlify from "samlify";
import * as validator from "@authenio/samlify-xsd-schema-validator";
import fs from "fs";

samlify.setSchemaValidator(validator);

const spData = {
  entityID: process.env.HOSTNAME,
  authnRequestsSigned: process.env.SAML_SP_AUTHNREQUESTSSIGNED,
  wantAssertionsSigned: process.env.SAML_SP_WANTASSERTIONSIGNED,
  wantMessageSigned: process.env.SAML_SP_WANTMESSAGESIGNED,
  wantLogoutResponseSigned: process.env.SAML_SP_WANTLOGOUTREQUESTSIGNED,
  wantLogoutRequestSigned: process.env.SAML_SP_WANTLOGOUTRESPONSESIGNED,
  isAssertionEncrypted: process.env.SAML_SP_ISASSERTIONENCRYPTED,
  assertionConsumerService: [
    {
      Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
      Location: process.env.HOSTNAME + "/auth/asc",
    },
    {
      Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect",
      Location: process.env.HOSTNAME + "/auth/asc",
    },
  ],
  singleLogoutService: [
    {
      Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
      Location: process.env.HOSTNAME + "/auth/slo",
    },
    {
      Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect",
      Location: process.env.HOSTNAME + "/auth/slo",
    },
  ],
};
if (process.env.SAML_PRIVATE_KEY)
  spData.privateKey = fs.readFileSync(process.env.SAML_PRIVATE_KEY);
if (process.env.SAML_PRIVATE_KEY_PASS)
  spData.privateKeyPass = process.env.SAML_PRIVATE_KEY_PASS;
if (process.env.SAML_ENC_PRIVATE_KEY)
  spData.encPrivateKey = fs.readFileSync(process.env.SAML_ENC_PRIVATE_KEY);

export const sp = samlify.ServiceProvider(spData);

export async function getIdp() {
  // get IDP metadata XML
  const IpdXmlFetch = await fetch(process.env.SAML_IDP_METADATA);
  const Idpxml = await IpdXmlFetch.text();

  const idpData = {
    metadata: Idpxml,
  };

  if (process.env.SAML_PRIVATE_KEY)
    idpData.privateKey = fs.readFileSync(process.env.SAML_PRIVATE_KEY);

  return samlify.IdentityProvider(idpData);
}

export function metadata() {
  return sp.getMetadata();
}
