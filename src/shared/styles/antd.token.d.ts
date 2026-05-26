import 'antd/es/theme/interface/alias';

declare module 'antd/es/theme/interface/alias' {
    interface AliasToken {
        /**
         * @nameZH 元素超大内间距
         * @description 为了适配AI写的屎，增加一个超大内间距字段
         */
        paddingXXL: number;
    }
}
