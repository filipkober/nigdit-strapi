import type { Schema, Attribute } from '@strapi/strapi';

export interface RulesRules extends Schema.Component {
  collectionName: 'components_rules_rules';
  info: {
    displayName: 'rules';
  };
  attributes: {
    rule: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'rules.rules': RulesRules;
    }
  }
}
