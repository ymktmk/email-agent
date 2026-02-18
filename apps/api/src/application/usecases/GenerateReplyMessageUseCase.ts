export type ReplyTone = 'polite' | 'casual' | 'business';

export type GenerateReplyMessageInput = {
  senderName?: string;
  receivedMessage: string;
  purpose?: string;
  tone?: ReplyTone;
  includeSignature?: boolean;
  signerName?: string;
};

export class GenerateReplyMessageUseCase {
  execute(input: GenerateReplyMessageInput): string {
    const normalizedMessage = input.receivedMessage.trim();

    if (!normalizedMessage) {
      throw new Error('receivedMessage は必須です。');
    }

    const tone = input.tone ?? 'polite';
    const senderName = input.senderName?.trim();
    const purpose = input.purpose?.trim();
    const signerName = input.signerName?.trim();
    const includeSignature = input.includeSignature ?? true;

    const greeting = this.createGreeting(tone, senderName);
    const thanks = this.createThanks(tone);
    const acknowledgement = this.createAcknowledgement(tone, normalizedMessage);
    const action = this.createActionLine(tone, purpose);
    const closing = this.createClosing(tone);
    const signature = includeSignature ? this.createSignature(tone, signerName) : '';

    return [greeting, thanks, acknowledgement, action, closing, signature]
      .filter((line) => line.length > 0)
      .join('\n\n');
  }

  private createGreeting(tone: ReplyTone, senderName?: string): string {
    if (!senderName) {
      return tone === 'casual' ? 'こんにちは。' : 'お世話になっております。';
    }

    if (tone === 'casual') {
      return `${senderName}さん、こんにちは。`;
    }

    return `${senderName}様\nお世話になっております。`;
  }

  private createThanks(tone: ReplyTone): string {
    if (tone === 'casual') {
      return 'ご連絡ありがとうございます。';
    }

    if (tone === 'business') {
      return 'この度はご連絡をいただき、誠にありがとうございます。';
    }

    return 'ご連絡いただきありがとうございます。';
  }

  private createAcknowledgement(tone: ReplyTone, receivedMessage: string): string {
    const summary = receivedMessage.replace(/\s+/g, ' ').slice(0, 120);

    if (tone === 'casual') {
      return `いただいた内容（「${summary}${receivedMessage.length > 120 ? '…' : ''}」）を確認しました。`;
    }

    return `ご共有いただいた内容（「${summary}${receivedMessage.length > 120 ? '…' : ''}」）を確認いたしました。`;
  }

  private createActionLine(tone: ReplyTone, purpose?: string): string {
    if (!purpose) {
      if (tone === 'casual') {
        return '必要な対応を進め、改めてご連絡します。';
      }

      return '内容を確認のうえ、必要な対応を進めてまいります。';
    }

    if (tone === 'casual') {
      return `${purpose}の件、対応を進めて後ほどご連絡します。`;
    }

    return `${purpose}につきまして、順次対応を進めてまいります。`;
  }

  private createClosing(tone: ReplyTone): string {
    if (tone === 'casual') {
      return 'どうぞよろしくお願いします。';
    }

    if (tone === 'business') {
      return '何卒よろしくお願い申し上げます。';
    }

    return '引き続きよろしくお願いいたします。';
  }

  private createSignature(tone: ReplyTone, signerName?: string): string {
    if (!signerName) {
      return '';
    }

    if (tone === 'casual') {
      return signerName;
    }

    return `${signerName}`;
  }
}
