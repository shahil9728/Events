export const ICONTYPE = {
    IONICON: 'ionicon',
    MATERIAL: 'material',
    FONTAWESOME: 'font-awesome',
    FEATHER: 'feather',
    ANTDESIGN: 'AntDesign',
    ENTYPO: 'Entypo',
}

export const OperationType = {
    UPDATE: 'UPDATE',
    CREATE: 'CREATE',
    VIEW: 'VIEW',
} as const;

export type OperationValue = (typeof OperationType)[keyof typeof OperationType];
