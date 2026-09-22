// login-pc.controller.ts
import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { LoginPcService } from './login-pc.service';
import { AuthGuard } from './auth.guard'; // Ajusta la ruta a tu guard

@Controller('login-pc')
export class LoginPcController {
  constructor(private readonly loginPcService: LoginPcService) {}

  // Endpoint público para iniciar sesión
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { cedula: string; clave: string }) {
    return this.loginPcService.login(body.cedula, body.clave);
  }

  // Endpoint PROTEGIDO (Ejemplo para probar la autorización)
  @UseGuards(AuthGuard)
  @Get('perfil')
  getPerfil(@Request() req) {
    // req.user contiene los datos decodificados del JWT (sub, cedula, nombre)
    return req.user;
  }
}