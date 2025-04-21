import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Request } from "express";
import { UAParser } from "ua-parser-js";


@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async createSession(req: Request,  userId: string, refreshToken: string) {
    const uaParser = new UAParser();
    const userAgent = req.headers['user-agent'] || '';
    uaParser.setUA(userAgent);
    const deviceInfo = uaParser.getResult()
    const ipAddress = req.ip || ''

    console.log(deviceInfo, ipAddress, req.ip, req.ips, req.headers['user-agent'])

    const session = await this.prisma.session.create({
      data: {
        userId: userId,
        device: `${deviceInfo.device.model} ${deviceInfo.os.name}`, 
        ipAddress: ipAddress,
        userAgent: userAgent,
        browser: deviceInfo.browser.name,
        refreshToken
      }
    })

    return session
  }

  async getSessions() {
    const sessions = await this.prisma.session.findMany()

    return sessions
  }
  
  async deleteSession(sessionId: string) {
    const session = await this.prisma.session.delete({
      where: {
        id: sessionId
      }
    })

    return session
  }

  async deleteAllSessions(userId: string) {
    
    const sessions = await this.prisma.session.deleteMany({
      where: {
        userId: userId
      }
    })

    return sessions
  }

  async getSession(sessionId: string) { 
    const session = await this.prisma.session.findUnique({
      where: {
        id: sessionId
      }
    })

    return session
  }

  async getSessionsByUserId(userId: string) {  
    const session = await this.prisma.session.findMany({
      where: {
        userId: userId
      }
    })

    return session
  }

  async updateSession (sessionId: string, refreshToken: string) {
    const session = await this.prisma.session.update({
      where: {
        id: sessionId
      },
      data: {
        refreshToken: refreshToken
      }
    })

    return session
  }
}