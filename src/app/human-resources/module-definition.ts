import { ModuleDefinition } from '../core/entities';

export const HrModuleDefinition: ModuleDefinition = {
    key: 'HumanResources',
    displayRelevance: 1,
    moduleRoutePath: '/humanresources',
    iconPath: '/assets/human-resources/human_resources_logo.svg',
    localizedNameKey: 'HUMAN_RESOURCES.MODULE_NAME',
    summaries: {
        hasSummaries: false
    },
    settings: {
        hasSettings: true,
        settingsRoutePath: '/humanresources/settings'
    }
};
