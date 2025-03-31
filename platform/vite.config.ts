import { fileURLToPath, URL } from 'node:url';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import vue from '@vitejs/plugin-vue';
import { type UserConfig, type ConfigEnv, loadEnv } from 'vite';

const CWD = process.cwd(); // 项目根目录（index.html 文件所在的位置）。

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  // 环境变量
  // const { VITE_BASE_URL, VITE_DROP_CONSOLE } = loadEnv(mode, CWD);
  const { VITE_BASE_URL } = loadEnv(mode, CWD);

  // 在开发环境下 command 的值为 serve（在 CLI 中， vite dev 和 vite serve 是 vite 的别名），而在生产环境下为 build（vite build）
  const isBuild = command === 'build';
  console.log('isBuild', isBuild);

  return {
    base: VITE_BASE_URL, //  开发或生产环境服务的公共基础路径：默认'/'
    esbuild: {
      // target: 'es2015'
    },
    plugins: [
      vue(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false // css in js
          })
        ]
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    /* 开发服务器选项 */
    server: {
      port: 5174, // 指定开发服务器端口。注意：如果端口已经被使用，Vite 会自动尝试下一个可用的端口，所以这可能不是开发服务器最终监听的实际端口。
      host: '0.0.0.0', // 指定服务器应该监听哪个 IP 地址，设置为 0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址。
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      proxy: {
        // 为开发服务器配置自定义代理规则。
        '/api': {
          target: 'https://www.00goo.com', // 测试环境
          // target: 'https://182ad43e.r36.cpolar.top',
          changeOrigin: true
          // rewrite: (path) => path.replace(/^\/system/, '')
        }
      }
    }
  };
};
