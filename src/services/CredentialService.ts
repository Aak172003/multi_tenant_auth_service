import bcrypt from "bcrypt";
export class CredentialService {
    async comparePassword(userPassword: string, hashedPassword: string) {
        const VerifyPassword = await bcrypt.compare(
            userPassword,
            hashedPassword,
        );

        console.log("verify or not ---------- ", VerifyPassword);

        return VerifyPassword;
    }
}
