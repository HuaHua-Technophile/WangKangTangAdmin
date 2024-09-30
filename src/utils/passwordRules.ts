export const passwordRule = [
  { required: true, message: "请输入密码", trigger: "blur" },
  { min: 6, max: 20, message: "密码长度为6~20个字符", trigger: "blur" },
  {
    validator: (_rule: any, value: string, callback: Function) => {
      if (/[\u4e00-\u9fa5\s]/.test(value))
        callback(new Error("密码不能包含中文或空格"));
      else callback();
    },
    trigger: "blur",
  },
];
