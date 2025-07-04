#!/usr/bin/env node
// This file is part of the Nick Sniper project.
// Nick Sniper is a tool for generating and checking available Minecraft nicknames.

import readline from 'readline';
import colors from 'colors/safe';

const getNickname = async (nickname: string) => {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${nickname}`, {
        method: 'GET'
    });

    if (!response.ok) {
        if (response.status == 429) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return getNickname(nickname);
        } else if (response.status == 404) {
            console.log(colors.green(`✅ ${nickname}`));
            return 'valid';
        }
    }

    const data = await response.json();
    if (data.available) {
        console.log(colors.green(`✅ ${nickname}`));
        return 'valid';
    } else {
        console.log(colors.red(`❌ ${nickname}`));
        return 'invalid';
    }
}

const wait = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const randomCharacter = (length: number, allowNumber: boolean) => {
    const characters = !allowNumber ? 'abcdefghijklmnopqrstuvwxyz_' : 'abcdefghijklmnopqrstuvwxyz0123456789_';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
console.log(colors.red(`

███▄▄▄▄    ▄█   ▄████████    ▄█   ▄█▄         ▄████████ ███▄▄▄▄    ▄█     ▄███████▄    ▄████████    ▄████████ 
███▀▀▀██▄ ███  ███    ███   ███ ▄███▀        ███    ███ ███▀▀▀██▄ ███    ███    ███   ███    ███   ███    ███ 
███   ███ ███▌ ███    █▀    ███▐██▀          ███    █▀  ███   ███ ███▌   ███    ███   ███    █▀    ███    ███ 
███   ███ ███▌ ███         ▄█████▀           ███        ███   ███ ███▌   ███    ███  ▄███▄▄▄      ▄███▄▄▄▄██▀ 
███   ███ ███▌ ███        ▀▀█████▄         ▀███████████ ███   ███ ███▌ ▀█████████▀  ▀▀███▀▀▀     ▀▀███▀▀▀▀▀   
███   ███ ███  ███    █▄    ███▐██▄                 ███ ███   ███ ███    ███          ███    █▄  ▀███████████ 
███   ███ ███  ███    ███   ███ ▀███▄         ▄█    ███ ███   ███ ███    ███          ███    ███   ███    ███ 
 ▀█   █▀  █▀   ████████▀    ███   ▀█▀       ▄████████▀   ▀█   █▀  █▀    ▄████▀        ██████████   ███    ███ 
                            ▀                                                                      ███    ███
`));
console.log(colors.bold(colors.red('Developed by KauaZs | https://github.com/KauaZs \n')));

rl.question(colors.red('➤ Insira a quantidade de caracteres do nickname: \n'), (input: string) => {
    const length = parseInt(input, 10);
    if (isNaN(length) || length < 3 || length > 16) {
        console.log('Por favor, insira um número válido maior ou igual a 3 e menor que 16.');
        rl.close();
        return;
    }

    rl.question(colors.red('➤ Insira o prefixo do nickname (deixe vazio se não houver): '), (prefix: string) => {
        if (prefix.length >= length) {
            console.log('O prefixo não pode ser maior ou igual que o comprimento total do nickname.');
            rl.close();
            return;
        }

        
        let prefixedNickname = null;
        let allowNumbers = false;
        if (prefix.length > 0) prefixedNickname = prefix;

        rl.question(colors.red('➤ Deseja permitir números no nickname? (s/n): \n'), (answer: string) => {
            if (answer.toLowerCase() !== 's' && answer.toLowerCase() !== 'n') {
                console.log('Por favor, responda com "s" para sim ou "n" para não.');   
                rl.close();
                return;
            }

            if (answer.toLowerCase() === 's') {
                allowNumbers = true;
            }


            rl.question(colors.red('➤ Quantidade de nicknames a serem gerados: \n'), async (countInput: string) => {
                const count = parseInt(countInput, 10);
                const charsAllowed = allowNumbers ? 'abcdefghijklmnopqrstuvwxyz0123456789_' : 'abcdefghijklmnopqrstuvwxyz_';
                
                if (isNaN(count) || count <= 0) {
                    console.log('Por favor, insira um número válido maior que zero.');
                    rl.close();
                    return;
                }

                
                const validNicknames: string[] = [];
                const nicknameSet = new Set<string>();
                for (let i = 0; i < count; i++) {
                    let nickname;
                    if (prefixedNickname) {
                        const remainingLength = length - prefixedNickname.length;
                        const chars = randomCharacter(remainingLength, allowNumbers)
                        
                        const total = Math.pow(charsAllowed.length, remainingLength);

                        if (count > total) {
                            console.log(colors.red(`Impossível gerar ${count} nicknames únicos com essas configurações.`));
                            console.log(colors.yellow(`Máximo de combinações possíveis: ${total}`));
                            rl.close();
                            return;
                        } else {
                           
                            const total = Math.pow(charsAllowed.length, remainingLength);

                            if (count > total) {
                                console.log(colors.red(`Impossível gerar ${count} nicknames únicos com essas configurações.`));
                                console.log(colors.yellow(`Máximo de combinações possíveis: ${total}`));
                                rl.close();
                                return;
                        }
                        }
                        nickname = `${prefixedNickname}${chars}`;

                        if (nicknameSet.has(nickname)) {
                            i--;
                            continue;
                        }
                    } else {
                        nickname = randomCharacter(length, allowNumbers);

                        if (nicknameSet.has(nickname)) {
                            i--;
                            continue;
                        }
                    }
                    nicknameSet.add(nickname);

                    const response = await getNickname(nickname)
                        .catch(error => console.error(`Erro ao verificar o nickname ${nickname}:`, error));

                    if (response === 'valid') validNicknames.push(nickname);

                }

                console.log(colors.bold(colors.yellow(`\nNicknames disponíveis encontrados (${validNicknames.length}):`)));
                if (validNicknames.length > 0) console.log(colors.green(validNicknames.join(', ')))
                rl.close()
                
            })
        })
    })
});

rl.on('SIGINT', () => {
        rl.close()
})